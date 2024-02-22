import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ProjectService } from './project.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

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
}
