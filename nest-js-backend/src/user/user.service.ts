import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DUser } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  private _currentUser: DUser;

  constructor(@InjectModel('User') private readonly userModel: Model<DUser>) {}

  set currentUser(user: DUser) {
    user.refreshToken = undefined;
    user.password = undefined;
    user.__v = undefined;

    this._currentUser = user;
  }

  get currentUser() {
    return this._currentUser;
  }

  async refreshCurrentUser() {
    this.currentUser = await this.userModel
      .findById(this._currentUser._id)
      .exec();
  }
}
