import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/project.schema';
import mongoose from 'mongoose';
import { AddProjectDto } from './dto/add-project.dto';

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

  async addProject(addProjectDto: AddProjectDto): Promise<Project> {
    try {
      const projectObj = {
        _id: new mongoose.Types.ObjectId(),
        project_name: addProjectDto.project_name,
        start_date: addProjectDto.start_date,
        duration: addProjectDto.duration,
        estimated_budget: addProjectDto.estimated_budget,
        short_description: addProjectDto.short_description,
        skills_required: addProjectDto.skills_required,
        platforms_to_be_built: addProjectDto.platforms_to_be_built,
        team_size: addProjectDto.team_size,
        team_structure: addProjectDto.team_structure.map((position) => ({
          title: position.title,
          allocation: position.allocation,
        })),

        allocated_resources: addProjectDto.allocated_resources.map(
          (resource) => ({
            name: resource.name,
            designation: resource.designation,
            allocation_percentage: resource.allocation_percentage,
            companyId: resource.companyId,
          }),
        ),
      };

      const savedProject = await new this.projectModel(projectObj).save();
      return savedProject;
    } catch (error) {
      console.error('Failed to add project', error);
      throw new InternalServerErrorException('Failed to add project');
    }
  }
}
