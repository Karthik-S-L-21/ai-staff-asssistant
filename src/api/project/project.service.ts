import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/project.schema';
import mongoose from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: mongoose.Model<Project | null>,
  ) {}

  async getAllProjects(): Promise<Project[]> {
    try {
      const projection = {
        project_name: 1,
        start_date: 1,
        duration: 1,
        _id: 1,
      };
      const projects = await this.projectModel.find({}, projection).exec();
      return projects;
    } catch (error) {
      throw new InternalServerErrorException('Failed to reach mongoDB');
    }
  }
}
