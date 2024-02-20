import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { UserRole } from '../enums/user-designation.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  designation: UserRole;

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true })
  allocated: boolean;

  @Prop({ required: true })
  primary_skill: string[];

  @Prop({ required: true })
  secondary_skill: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
