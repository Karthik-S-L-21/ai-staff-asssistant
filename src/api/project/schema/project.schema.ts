import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { currDate } from '../../../utils/date-time.util';
import {
  Platforms,
  ProjectAllocationStatus,
  ProjectStatus,
} from '../enums/project.enum';
import { Position } from './position.schema';
import { Resource } from './resource.schema';

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
  project_status: ProjectStatus;

  @Prop({ required: true, default: ProjectAllocationStatus.Unallocated })
  project_allocation_status: ProjectAllocationStatus;

  @Prop({ required: true })
  skills_preferred: string[];

  @Prop()
  skills_required?: string[];

  @Prop({ required: true })
  platforms_to_be_built: Platforms[];

  @Prop()
  team_size?: number;

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
