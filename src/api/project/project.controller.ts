import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { AddProjectDto } from './dto/add-project.dto';

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
}
