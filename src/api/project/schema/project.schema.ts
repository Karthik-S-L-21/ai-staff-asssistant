import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Platforms } from '../enums/project.enum';
import { Position, PositionSchema } from './position.schema';
import { Resource } from './resource.schema';
import { currDate, toUTC } from '../../../utils/date-time.util';

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  project_name: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  duration: string;

  @Prop()
  estimated_budget: string;

  @Prop()
  short_description: string;

  @Prop({ required: true })
  skills_preferred: string[];

  @Prop()
  skills_required?: string[];

  @Prop({ required: true })
  platforms_to_be_built: Platforms[];

  @Prop()
  team_size?: number;

  //@Prop({ type: PositionSchema })
  @Prop()
  team_structure?: Position[];

  @Prop()
  allocated_resources?: Resource[];

  @Prop({ type: Date, default: () => currDate() })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
