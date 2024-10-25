import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { accessTokenExpiresIn, refreshTokenExpiresIn } from 'src/constants';
import { DUser } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel('User') private readonly userModel: Model<DUser>,
  ) {}

  async login(email: string, password: string) {
    // Load the user from the database
    const user = await this.userModel
      .findOne({
        email,
      })
      .select('+password')
      .select('+refreshToken');

    // If the user does not exist, throw a NotFoundException
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Compare the provided password with the stored hash
    const valid = await bcrypt.compare(password, user.password);

    // If the password is invalid, throw a ForbiddenException
    if (!valid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Generate a new access token
    const accessToken = await this.generateNewAccessToken(user);

    let refreshToken;

    try {
      // Validate the existing refresh token
      this.validateToken(user.refreshToken);
      // If valid, use the existing refresh token
      refreshToken = user.refreshToken;
    } catch {
      // If not valid, generate a new refresh token
      refreshToken = await this.generateNewRefreshToken(user);
    }

    // Return the user object, access token, and refresh token
    return {
      accessToken,
      refreshToken,
    };
  }

  async register(newUser: { email: string; name: string; password: string }) {
    // Check if the user exists
    const userFound = await this.userModel.findOne({
      email: newUser.email,
    });

    if (userFound) {
      throw new ConflictException('User already exists');
    }

    const user = {
      ...newUser,
      _id: randomUUID(),
      roles: [],
      password: await bcrypt.hash(newUser.password, 10),
    } as DUser;

    // Create a new user
    await this.userModel.create(user);

    // Generate a new access token
    const accessToken = await this.generateNewAccessToken(user);

    // Generate a new refresh token
    const refreshToken = await this.generateNewRefreshToken(user);

    // Return the user object, access token, and refresh token
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    user.refreshToken = null;

    await this.userModel.updateOne(
      {
        email,
      },
      user,
    );

    return { message: 'User logged out successfully' };
  }

  validateToken(token: string) {
    let decoded;
    try {
      decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }

    return decoded;
  }

  async validateRefreshToken(refreshToken: string): Promise<DUser> {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }

    // Retrieve user information based on the payload
    const user = await this.userModel
      .findOne({
        _id: payload._id,
      })
      .select('+refreshToken');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the token matches the saved refresh token
    const isEqualToSavedToken = user.refreshToken == refreshToken;

    if (!isEqualToSavedToken)
      throw new ForbiddenException('Outdated refresh token');

    return user;
  }

  async generateNewAccessToken(user: DUser): Promise<string> {
    return this.jwtService.sign(
      { _id: user._id, name: user.name, email: user.email, roles: user.roles },
      { expiresIn: accessTokenExpiresIn },
    );
  }

  async generateNewRefreshToken(user: DUser): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { _id: user._id, name: user.name, email: user.email },
      { expiresIn: refreshTokenExpiresIn },
    );

    user.refreshToken = refreshToken;

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        refreshToken,
      },
    );

    return refreshToken;
  }
}
