import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { accessTokenExpiresIn, refreshTokenExpiresIn } from 'src/constants';
import { User } from 'src/user/user.entity';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from './refreshToken.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  @Cron('0 * * * *') // Runs every hour
  async removeExpiredTokens() {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  async login(email: string, password: string, oldRefreshToken?: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Load the user from the database with the password field
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password'], // Include necessary fields
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Compare the provided password with the stored hash
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Generate a new access token
    const accessToken = await this.generateNewAccessToken(user);

    // Generate a new refresh token and store it in the database
    const refreshToken = await this.generateNewRefreshToken(
      user,
      oldRefreshToken,
    );

    // Return the access token and refresh token
    return { accessToken, refreshToken };
  }

  async register(newUser: { email: string; name: string; password: string }) {
    const { email, name, password } = newUser;

    if (!email || !name || !password) {
      throw new BadRequestException('Email, name, and password are required');
    }

    const userFound = await this.userRepository.findOne({
      where: { email },
    });

    if (userFound) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    // Save the new user to the database
    await this.userRepository.save(user);

    // Generate a new access token
    const accessToken = await this.generateNewAccessToken(user);

    // Generate a new refresh token and store it in the database
    const refreshToken = await this.generateNewRefreshToken(user);

    // Return the access token and refresh token
    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.delete({ refreshToken });
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.id },
        relations: ['roles', 'roles.permissions'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch {
      throw new ForbiddenException('Invalid token');
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<User> {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { refreshToken },
      relations: ['user', 'user.roles'],
    });

    if (!tokenEntity || tokenEntity.expiresAt < new Date()) {
      throw new ForbiddenException('Refresh token expired or not found');
    }

    return tokenEntity.user;
  }

  async generateNewAccessToken(user: User): Promise<string> {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      { expiresIn: accessTokenExpiresIn },
    );
  }

  async generateNewRefreshToken(
    user: User,
    oldRefreshToken?: string,
  ): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: `${refreshTokenExpiresIn}s` }, // Ensure correct format
    );

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + refreshTokenExpiresIn);

    const newRefreshToken = this.refreshTokenRepository.create({
      refreshToken,
      expiresAt,
      user,
    });

    // Delete the old refresh token if exists
    if (oldRefreshToken) {
      await this.refreshTokenRepository.delete({
        refreshToken: oldRefreshToken,
      });
    }

    await this.refreshTokenRepository.save(newRefreshToken);

    return refreshToken;
  }

  async canAccess(
    request: any,
    permissions: string[],
  ): Promise<{ [key: string]: boolean }> {
    const token = request.headers['authorization'];

    if (!token) throw new UnauthorizedException('No token provided');

    const [, tokenValue] = token.split(' ');

    if (!tokenValue) throw new UnauthorizedException('No token provided');

    const user = await this.validateToken(tokenValue);

    const userPermissions = user.roles
      .flatMap((role) => role.permissions)
      .map((permission) => permission.name);

    const result: { [key: string]: boolean } = {};

    for (const permission of permissions) {
      if (userPermissions.includes('admin')) {
        result[permission] = true;
        continue;
      }
      result[permission] = userPermissions.includes(permission);
    }

    return result;
  }
}
