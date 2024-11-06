import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { refreshTokenExpiresIn } from 'src/constants';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const { accessToken, refreshToken } = await this.authService.login(
      email,
      password,
    );

    // Set refresh token as an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn * 1000, // Convert to milliseconds
    });

    res.send({ accessToken });
  }

  @Post('register')
  async register(
    @Body() body: { email: string; name: string; password: string },
    @Res() res: Response,
  ) {
    if (!body.email || !body.name || !body.password) {
      throw new BadRequestException('Email, name, and password are required');
    }

    const { accessToken, refreshToken } = await this.authService.register(body);

    // Set refresh token as an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn * 1000,
    });

    res.send({ accessToken });
  }

  @Get('getAccessToken')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    // Check if refresh token is provided
    if (!refreshToken) throw new ForbiddenException('No refresh token');

    // Verify and decode the refresh token
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const user = await this.authService.validateRefreshToken(refreshToken);

    // Generate a new access token
    const accessToken = await this.authService.generateNewAccessToken(user);

    // Generate a new refresh token
    const newRefreshToken = await this.authService.generateNewRefreshToken(
      user,
      refreshToken,
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn * 1000, // Convert to milliseconds
    });

    // Send the new access token
    res.send({ accessToken });
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken', { httpOnly: true });
    res.send({ message: 'Logged out successfully' });
  }

  @Post('canAccess')
  async canAccess(@Req() req: Request, @Body() body: { permission: string }) {
    return this.authService.canAccess(req, body.permission);
  }

  @Post('logOutUser')
  async logOutUser(@Body() body: { email: string }) {
    return this.authService.logout(body.email);
  }
}
