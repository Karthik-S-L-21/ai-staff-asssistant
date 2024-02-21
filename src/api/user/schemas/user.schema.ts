import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { UserDesignation, UserRole } from '../enums/user-designation.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone_number: string;

  @Prop({ required: true })
  role: UserRole;

  @Prop({ required: true })
  designation: UserDesignation;

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true })
  allocated: boolean;

  @Prop({ required: true })
  current_allocated_projects: string[];

  @Prop()
  allocated_percentage: number;

  @Prop({ required: true })
  primary_skill: string[];

  @Prop({ required: true })
  secondary_skill: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
