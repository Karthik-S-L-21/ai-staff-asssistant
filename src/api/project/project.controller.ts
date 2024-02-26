import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProjectService } from './project.service';
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
}
