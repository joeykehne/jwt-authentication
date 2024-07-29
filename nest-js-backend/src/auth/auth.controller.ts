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
import { accessTokenExpiresIn } from 'src/constants';
import { DUser } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private user: UserService,
  ) {}

  /**
   * Endpoint to get information about the currently authenticated user.
   * @param req The request object containing the authorization header.
   * @param res The response object to send the user data.
   */
  @Get('whoami')
  async whoAmI(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.headers.authorization.split(' ')[1];

    if (!accessToken) throw new ForbiddenException('No token provided');
    try {
      const { _id } = this.jwtService.decode(accessToken);
      this.user.currentUser._id = _id;

      await this.user.refreshCurrentUser();
      res.send(this.user.currentUser);
    } catch (error) {
      throw new NotFoundException('Deprecated token', error);
    }
  }

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
    const { user, accessToken, refreshToken } = await this.auth.login(
      body.email,
      body.password,
    );

    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    // Send user data and access token
    res.send({
      user,
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
    const { user, accessToken, refreshToken } = await this.auth.register(body);

    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    // Send user data and access token
    res.send({
      user,
      accessToken,
    });
  }

  /**
   * Endpoint to logout the currently authenticated user.
   * @param res The response object to send an empty response.
   */
  @Get('logout')
  async logout(@Res() res: Response) {
    this.user.currentUser = {} as DUser;

    // Clear the refresh token cookie
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });

    res.send();
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
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'), // Secret for refresh token
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

    this.user.currentUser = user;

    // Generate a new access token
    const accessToken = this.jwtService.sign(
      { _id: user._id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: accessTokenExpiresIn,
      },
    );

    // Send the new access token
    res.send({ accessToken: accessToken });
  }
}
