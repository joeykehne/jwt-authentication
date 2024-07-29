import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DUser = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  email: string;

  @Prop()
  resetID: string;

  @Prop()
  refreshToken: string;

  @Prop()
  isPaying: boolean;

  @Prop({ select: false })
  __v: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
