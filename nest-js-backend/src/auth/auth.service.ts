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
import { randomUUID } from 'crypto';
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

  @Cron('0 0 * * *') // Runs once a day at midnight
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
      select: ['_id', 'email', 'name', 'password', 'roles'], // Include necessary fields
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
      _id: randomUUID(),
      roles: 'user', // Assign default roles as needed
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

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<User> {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });

    if (!tokenEntity || tokenEntity.expiresAt < new Date()) {
      throw new ForbiddenException('Refresh token expired or not found');
    }

    return tokenEntity.user;
  }

  async generateNewAccessToken(user: User): Promise<string> {
    return this.jwtService.sign(
      { _id: user._id, name: user.name, email: user.email, roles: user.roles },
      { expiresIn: accessTokenExpiresIn },
    );
  }

  async generateNewRefreshToken(
    user: User,
    oldRefreshToken?: string,
  ): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { _id: user._id, email: user.email },
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
}
