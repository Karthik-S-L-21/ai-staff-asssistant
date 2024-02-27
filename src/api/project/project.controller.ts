import {
  Body,
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AddProjectDto } from './dto/add-project.dto';
import { ProjectsParamDto } from './dto/project-param.dto';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/')
  async getAllProjects() {
    const projects = await this.projectService.getAllProjects();
    return {
      status: 200,
      message: 'Projects data fetched successfully.',
      result: projects,
    };
  }

  @Get('/:id')
  async getProjectById(@Param() projectParamDto: ProjectsParamDto) {
    const project = await this.projectService.getProjectById(
      projectParamDto.id,
    );
    if (project == null) {
      throw new NotFoundException('Project not found.');
    }
    return {
      statusCode: 200,
      message: 'Projects Fetched Successfully',
      result: project,
    };
  }

  @Post('/')
  async addProject(@Body() addProjectDto: AddProjectDto) {
    try {
      const response = await this.projectService.addProject(addProjectDto);
      if (response) {
        return {
          status: 201,
          message: 'Project Saved successfully.',
          result: response,
        };
      }
    } catch (err) {}
  }

  @Get('/initiate-allocation/:id')
  async initiateAllocation(@Param() projectParamDto: ProjectsParamDto) {
    const response = await this.projectService.initiateAllocation(
      projectParamDto,
      'ML-url',
    );
    return {
      status: 200,
      message: 'allocation successfully initiated.',
      result: response,
    };
  }
}
