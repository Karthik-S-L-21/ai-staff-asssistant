import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDesignation } from '../../user/enums/user-designation.enum';

export type ResourceDocument = HydratedDocument<Resource>;

@Schema({ _id: false })
export class Resource {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  designation: UserDesignation;

  @Prop({ required: true })
  allocation_percentage: number;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
