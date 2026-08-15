import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  // Set for Google users; guests have no email.
  @Prop({ trim: true, lowercase: true, unique: true, sparse: true })
  email?: string;

  @Prop()
  avatarUrl?: string;

  // Optional profile fields edited on the Settings page.
  @Prop({ default: '' })
  title?: string;

  @Prop({ default: '' })
  username?: string;

  @Prop({ default: false })
  isGuest: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
