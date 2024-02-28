import {
  Body,
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AddProjectDto } from './dto/add-project.dto';
import { ProjectsParamDto } from './dto/project-param.dto';
import { UpdateProjectDto } from './dto/update_project.dto';

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

  @Patch('/update-project/:id')
  async updateProject(
    @Param() projectParamDto: ProjectsParamDto,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const response = await this.projectService.updateProject(
      projectParamDto.id,
      updateProjectDto,
    );
    return {
      status: 200,
      message: 'Project Updated successfully.',
      result: response,
    };
  }

  @Patch('/freeze-list/:id')
  async freezeList(
    @Param() projectParamDto: ProjectsParamDto,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const response = await this.projectService.freezeList(
      projectParamDto.id,
      updateProjectDto,
    );
    return {
      status: 200,
      message: 'Project List Freezed  successfully.',
      result: response,
    };
  }
}
