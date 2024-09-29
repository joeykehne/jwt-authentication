import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { accessTokenExpiresIn, refreshTokenExpiresIn } from 'src/constants';
import { DUser } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Endpoint to login a user with email and password, returns access and refresh tokens.
   * @param body The request body containing email and password.
   * @param res The response object to send the user data and tokens.
   */
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    if (!body.email || !body.password) {
      throw new ForbiddenException('Email and password are required');
    }

    const { user, accessToken, refreshToken } = await this.auth.login(
      body.email,
      body.password,
    );

    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: refreshTokenExpiresIn * 1000, // Convert to milliseconds
    });

    // Send user data and access token
    res.send({
      accessToken,
    });
  }

  /**
   * Endpoint to register a new user and returns access and refresh tokens.
   * @param body The request body containing user details.
   * @param res The response object to send the user data and tokens.
   */
  @Post('register')
  async register(@Body() body: DUser, @Res() res: Response) {
    if (!body.email || !body.password) {
      throw new ForbiddenException('Email and password are required');
    }

    const { user, accessToken, refreshToken } = await this.auth.register(body);

    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: refreshTokenExpiresIn * 1000, // Convert to milliseconds
    });

    // Send user data and access token
    res.send({
      accessToken,
    });
  }

  /**
   * Endpoint to logout the currently authenticated user.
   * @param req The request object containing the authorization token.
   * @param res The response object to send an empty response.
   */
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
      this.auth.logout(payload._id);
    } catch (e) {}

    // Clear the refresh token cookie
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });

    res.send({
      message: 'Logged out successfully',
    });
  }

  /**
   * Endpoint to refresh the access token using the refresh token.
   * @param req The request object containing cookies.
   * @param res The response object to send the new access token.
   */
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

    // Retrieve user information based on the payload
    const user = await this.auth.findUserByIdWithRefreshToken(payload._id); // Assume `_id` is user ID
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the token matches the saved refresh token
    const isEqualToSavedToken = user.refreshToken == refreshToken;

    if (!isEqualToSavedToken)
      throw new ForbiddenException('Outdated refresh token');

    // Generate a new access token
    const accessToken = this.jwtService.sign(
      { _id: user._id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: accessTokenExpiresIn,
      },
    );

    // Send the new access token
    res.send({ accessToken });
  }
}
