import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDesignation } from '../../user/enums/user-designation.enum';

export type PositionDocument = HydratedDocument<Position>;

@Schema({ _id: false })
export class Position {
  @Prop({ required: true })
  title: UserDesignation;

  @Prop({ required: true })
  allocation: number;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
