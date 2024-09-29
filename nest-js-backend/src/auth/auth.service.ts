import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { accessTokenExpiresIn, refreshTokenExpiresIn } from 'src/constants';
import { DUser } from 'src/schemas/user.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<DUser>,
    private configService: ConfigService,
  ) {}

  /**
   * Authenticates a user with email and password.
   * @param email The user's email.
   * @param password The user's password.
   * @returns The authenticated user, access token, and refresh token.
   * @throws NotFoundException if the user does not exist.
   * @throws ForbiddenException if the password is invalid.
   */
  async login(email: string, password: string) {
    // Retrieve the user by email, including the password hash
    const user: DUser = await this.findUserByEmailWithPassword(email);

    // If the user does not exist, throw a NotFoundException
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Compare the provided password with the stored hash
    const valid = await bcrypt.compare(password, user.password);

    // If the password is invalid, throw a ForbiddenException
    if (!valid) {
      throw new ForbiddenException('Invalid password');
    }

    // Generate a new access token
    const accessToken = this.jwtService.sign(
      { _id: user._id },
      { expiresIn: accessTokenExpiresIn },
    );

    let refreshToken;

    try {
      // Validate the existing refresh token
      this.validateToken(user.refreshToken);
      // If valid, use the existing refresh token
      refreshToken = user.refreshToken;
    } catch {
      // If not valid, generate a new refresh token
      refreshToken = await this.generateNewRefreshToken(user._id);
    }

    // Return the user object, access token, and refresh token
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Registers a new user.
   * @param providedUserData The user data provided during registration.
   * @returns The registered user, access token, and refresh token.
   * @throws ConflictException if the user already exists.
   */
  async register(providedUserData: Partial<DUser>) {
    // Check if a user with the given email already exists
    if (await this.findUserByEmailWithPassword(providedUserData.email)) {
      throw new ConflictException('User already exists');
    }

    // Generate a salt and hash the provided password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(providedUserData.password, salt);
    providedUserData.password = hashedPassword;

    // Create a new user document with the provided data
    const user = new this.userModel(providedUserData);

    // Assign a unique ID to the user
    user._id = uuid();

    // Generate a new access token
    const accessToken = this.jwtService.sign(
      { _id: user._id },
      { expiresIn: accessTokenExpiresIn },
    );

    // Generate a new refresh token
    const refreshToken = await this.generateNewRefreshToken(user._id);

    // Assign the refresh token to the user
    user.refreshToken = refreshToken;

    // Save the user document to the database
    await user.save();

    // Return the user object, access token, and refresh token
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logs out a user by removing their refresh token.
   * @param userId The user's ID.
   * @returns A success message.
   * @throws NotFoundException if the user does not exist.
   */
  async logout(userId: string): Promise<{ message: string }> {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    user.refreshToken = null;
    await user.save();

    return { message: 'User logged out successfully' };
  }

  /**
   * Generates a new refresh token for the given user ID.
   * @param _id The user's ID.
   * @returns The new refresh token.
   */
  async generateNewRefreshToken(_id: string): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { _id: _id },
      { expiresIn: refreshTokenExpiresIn },
    );

    await this.userModel
      .updateOne({ _id: _id }, { refreshToken: refreshToken })
      .exec();

    return refreshToken;
  }

  /**
   * Finds a user by their ID.
   * @param _id The user's ID.
   * @returns The user document.
   */
  findUserById(_id: string): Promise<DUser> {
    return this.userModel.findById(_id).exec();
  }

  /**
   * Finds a user by their ID and includes the refresh token in the result.
   * @param _id The user's ID.
   * @returns The user document with the refresh token.
   */
  findUserByIdWithRefreshToken(_id: string): Promise<DUser> {
    return this.userModel.findById(_id).select('+refreshToken').exec();
  }

  /**
   * Finds a user by their email and includes the password in the result.
   * @param email The user's email.
   * @returns The user document with the password.
   */
  findUserByEmailWithPassword(email: string): Promise<DUser> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  /**
   * Validates a given token.
   * @param token The token to validate.
   * @returns The decoded token if valid.
   * @throws Error if the token is invalid.
   */
  validateToken(token: string) {
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }

    return true;
  }
}
