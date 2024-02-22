import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PositionDocument = HydratedDocument<Position>;

@Schema({ _id: false })
export class Position {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  allocation: number;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
