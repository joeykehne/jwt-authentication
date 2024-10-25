import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { refreshTokenExpiresIn } from 'src/constants';
import { AdminGuard } from './admin.guard';
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
    if (!body.email || !body.password) {
      throw new ForbiddenException('Email and password are required');
    }

    const { accessToken, refreshToken } = await this.authService.login(
      body.email,
      body.password,
    );

    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn * 1000, // Convert to milliseconds
    });

    // Send user data and access token
    res.send({
      accessToken,
    });
  }

  @Post('register')
  async register(
    @Body() body: { email: string; name: string; password: string },
    @Res() res: Response,
  ) {
    if (!body.email || !body.password) {
      throw new ForbiddenException('Email and password are required');
    }

    const { accessToken, refreshToken } = await this.authService.register(body);

    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn * 1000, // Convert to milliseconds
    });

    // Send user data and access token
    res.send({
      accessToken,
    });
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
    const newRefreshToken =
      await this.authService.generateNewRefreshToken(user);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn * 1000, // Convert to milliseconds
    });

    // Send the new access token
    res.send({ accessToken });
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    // get user id from token in cookie
    const refreshToken = req.cookies?.['refreshToken'];

    // Delete the refresh token from the database
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      this.authService.logout(payload.email);
    } catch (e) {}

    // Clear the refresh token cookie
    res.cookie('refreshToken', '', {
      httpOnly: true,
      maxAge: 0,
    });

    res.send({
      message: 'Logged out successfully',
    });
  }

  @UseGuards(AdminGuard)
  @Post('logOutUser')
  async logOutUser(@Body() body: { email: string }) {
    return this.authService.logout(body.email);
  }
}
