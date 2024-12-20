import { MailerService } from '@nestjs-modules/mailer';
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
import { Response } from 'express';
import { accessTokenExpiresIn, refreshTokenExpiresIn } from 'src/constants';
import { T_TokenType } from 'src/interfaces';
import { User } from 'src/user/user.entity';
import { LessThan, Repository } from 'typeorm';
import { Permission } from './permission/permission.entity';
import { RefreshToken } from './refreshToken.entity';
import { Role } from './role/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private mailerService: MailerService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
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

    await this.sendEmailVerificationMail(email);

    // get the amount of users in the database
    const count = await this.userRepository.count();

    if (count === 1) {
      const permission = this.permissionRepository.create({
        name: 'admin',
        description: 'Admin permission',
      });
      await this.permissionRepository.save(permission);

      const role = this.roleRepository.create({
        name: 'admin',
        permissions: [permission],
      });
      await this.roleRepository.save(role);

      user.roles = [role];

      await this.userRepository.save(user);
    }

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

  async logoutUserEverywhere(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }

  async validateToken(token: string, type: T_TokenType): Promise<any> {
    let payload;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }

    if (type && payload.type != type) {
      throw new ForbiddenException('Invalid token type');
    }

    return payload;
  }

  async validateRefreshToken(
    res: Response,
    refreshToken: string,
  ): Promise<User> {
    await this.validateToken(refreshToken, 'refresh');

    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { refreshToken },
      relations: ['user', 'user.roles'],
    });

    if (!tokenEntity || tokenEntity.expiresAt < new Date()) {
      res.clearCookie('refreshToken', { httpOnly: true });
      throw new UnauthorizedException('Invalid refresh token');
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
        type: 'access' as T_TokenType,
      },
      { expiresIn: accessTokenExpiresIn },
    );
  }

  async generateNewRefreshToken(
    user: User,
    oldRefreshToken?: string,
  ): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email, type: 'refresh' as T_TokenType },
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

    const payload = await this.validateToken(tokenValue, 'access');

    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

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

  async sendForgotPasswordMail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    // Generate a new reset password link
    const resetPasswordToken = this.jwtService.sign(
      { email: user.email, type: 'resetPassword' as T_TokenType },
      { expiresIn: '30m' }, // 30 minutes
    );

    // Save the reset password token to the user
    user.resetPasswordToken = resetPasswordToken;

    await this.userRepository.save(user);

    // Send the reset password link to the user's email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${this.configService.get('FRONTEND_URL')}/resetPassword/${resetPasswordToken}">here</a> to reset your password. The link is only active for 30 minutes.</p>`,
    });
  }

  async resetPassword(email: string, newPassword: string) {
    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;

    // Remove the reset password token
    user.resetPasswordToken = null;

    // Save the user
    await this.userRepository.save(user);
  }

  createVerifyEmailToken(user: User) {
    return this.jwtService.sign(
      { id: user.id, type: 'emailVerification' as T_TokenType },
      { expiresIn: '1d' }, // 1 day
    );
  }

  async sendEmailVerificationMail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const emailToken = this.createVerifyEmailToken(user);

    this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${this.configService.get(
        'FRONTEND_URL',
      )}/verifyEmail/${emailToken}">here</a> to verify your email.</p>`,
    });
  }

  async verifyEmail(token: string) {
    const payload = await this.validateToken(token, 'emailVerification');

    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.emailVerified = true;

    await this.userRepository.save(user);
  }
}
