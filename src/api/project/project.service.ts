import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/project.schema';
import mongoose, { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { AddProjectDto } from './dto/add-project.dto';
import { ProjectsParamDto } from './dto/project-param.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UpdateProjectDto } from './dto/update_project.dto';

import { UserService } from '../user/user.service';
import { positionToCategoryMap } from './constants/project-constants';
import { FreezeProjectDto } from './dto/freeze_list.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: mongoose.Model<Project | null>,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  async getAllProjects(): Promise<Project[]> {
    try {
      const projection = {
        project_name: 1,
        start_date: 1,
        duration: 1,
        project_status: 1,
        _id: 1,
      };
      const projects = await this.projectModel
        .find({}, projection)
        .sort({ createdAt: -1 })
        .exec();
      return projects;
    } catch (error) {
      throw new InternalServerErrorException('Failed to reach mongoDB');
    }
  }

  async getProjectById(projectId: string): Promise<Project> {
    const project = await this.projectModel.findOne({
      _id: projectId,
    });
    return project;
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
        project_status: addProjectDto.project_status,
        skills_preferred: addProjectDto.skills_preferred,
        skills_required: addProjectDto.skills_required,
        platforms_to_be_built: addProjectDto.platforms_to_be_built,
        team_size: addProjectDto.team_size,
        team_structure: addProjectDto.team_structure?.map((position) => ({
          title: position.title,
          allocation: position.allocation,
          category: positionToCategoryMap[position.title],
        })),

        allocated_resources: addProjectDto.allocated_resources?.map(
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
      throw new InternalServerErrorException('Failed to add project');
    }
  }

  async initiateAllocation(projectParamDto: ProjectsParamDto, mlUrl: string) {
    try {
      const projectDetails = await this.getProjectById(projectParamDto.id);
      // console.log(
      //   '🚀 ~ ProjectService ~ initiateAllocation ~ projectDetails:',
      //   projectDetails,
      // );
      const mlRequestData = {
        prompt_question: `
          Project Name: ${projectDetails.project_name}
          Project Description: ${projectDetails.short_description}
          Duration: ${projectDetails.duration}
          Budget: ${projectDetails.estimated_budget}
          Start Date: ${projectDetails.start_date}
          Skills Preferred: ${projectDetails.skills_preferred}
          Platforms to be built:
          ${projectDetails.platforms_to_be_built
            .map((platform) => ` - ${platform}`)
            .join('\n')}
          Suggest total team size, Engineering team structure with their names and allocation percentage
          and Tech stacks. Engineering team structure consists of title of engineer and percentage of allocation of
          engineer into the project.
        `,
      };
      // console.log(
      //   '🚀 ~ ProjectService ~ initiateAllocation ~ mlRequestData:',
      //   mlRequestData,
      // );

      // Make a request to the ML API
      // const mlApiResponse = await firstValueFrom(
      //   this.httpService.post(mlUrl, mlRequestData),
      // );
      // const mlResponseData = mlApiResponse.data;
      const mlResponseData2 = `Project Name: Langchain POC
      Project Description: This is a proof-of-concept project aimed at exploring the capabilities of Langchain.
      Duration: 2 Months
      Budget: $0.25M
      Start Date: 03-01-2024
Platforms to be built:
        - Web (preferably angular)
        - Backend (preferably java)
        - Machine Learning Langchain 
Engineering Team:
          - Team Structure:
            - Frontend Lead (FE Lead) - 1 Name - Mihir Suchak (100% allocation)
            - Frontend Software Engineer (FE SE) - 1 Name - Aster Savio Fernandez (100% allocation)
            - Backend Lead (BE Lead) - 1 Name - Yadulla Naresh Reddy (50% allocation)
            - Backend Associate Software Engineer (BE ASE) - 1 Name - Shweta Ravi Talapalli (100% allocation)
            - Quality Engineer (QA SSE) - 1 Name - Vighnesh V Pai (100% allocation)
            - Engineering Manager - 1 Name - Shashanka N (50% allocation)
            - Project Manager - 1 Name - S. Vakesh (100% allocation)
            - Product Manager - 1 Name - Utpreksha Singh (50% allocation)
            - Director of Engineering - 1 Name - Shanti Kuropati (25% allocation)
          - Total Team Size: 9
Tech Stacks:
        - Java
        - Python
        - Machine Learning`;
      const result2 = await this.transformMlApiResponse(mlResponseData2);
      console.log(
        '🚀 ~ ProjectService ~ initiateAllocation ~ result2:',
        result2,
      );
      return {
        statusCode: 200,
        message: 'Initiation Successful',
        result: result2,
      };
    } catch (error) {
      console.log('🚀 ~ ProjectService ~ initiateAllocation ~ error:', error);

      //dummy data for timebeing
      return {
        projectName: 'Gen AI POC',
        projectDescription:
          'This is a proof-of-concept project aimed at exploring the capabilities of Gen AI.',
        duration: '6 Months',
        budget: '$0.25M',
        startDate: '06-30-2024',
        platformsToBeBuilt: ['Web', 'Backend'],
        engineeringTeam: {
          teamStructure: [
            {
              title: 'Frontend Lead (FE Lead)',
              name: 'Suchak Mihir Dinkarray',
              allocation: 100,
              category: 'Frontend',
              stream: 'Technology',
              current_allocated_projects: ['Loreal'],
              skills: ['python', 'java'],
              experience: '17',
            },
            {
              title: 'Frontend Software Engineer (FE SE)',
              name: 'Raghav Sharma',
              allocation: 100,
              category: 'Frontend',
              stream: 'Technology',
              current_allocated_projects: ['Loreal'],
              skills: ['python', 'java'],
              experience: '17',
            },
            {
              title: 'Backend Lead (BE Lead)',
              name: 'Srijita Thakur',
              allocation: 50,
              category: 'Backend',
              stream: 'Technology',
              current_allocated_projects: ['Loreal'],
              skills: ['python', 'java'],
              experience: '17',
            },
            {
              title: 'Backend Associate Software Engineer (BE ASE)',
              name: 'Bandhan Roy',
              allocation: 100,
              category: 'Backend',
              stream: 'Technology',
              current_allocated_projects: ['Loreal'],
              skills: ['python', 'java'],
              experience: '31',
            },
            {
              title: 'Quality Engineer (QA SSE)',
              name: 'Aishwarya Chandrakant Madiwal',
              allocation: 100,
              category: 'QA',
              stream: 'QualityAssurance',
              current_allocated_projects: ['Loreal'],
              skills: ['python', 'java'],
              experience: '22',
            },
            {
              title: 'Engineering Manager',
              name: 'Vinay S',
              allocation: 50,
              category: 'Management',
              stream: 'Management',
              current_allocated_projects: ['Loreal'],
              skills: ['python', 'java'],
              experience: '17',
            },
            {
              title: 'Project Manager',
              name: 'Maryam Fatima',
              allocation: 100,
              category: 'Management',
              stream: 'Management',
              current_allocated_projects: ['Lecet'],
              skills: ['python', 'java'],
              experience: '19',
            },
            {
              title: 'Product Manager',
              name: 'Pallavi Tandan',
              allocation: 50,
              category: 'Management',
              stream: 'Management',
              current_allocated_projects: ['Lecet'],
              skills: ['python', 'java'],
              experience: '28',
            },
            {
              title: 'Director of Engineering',
              name: 'Shubhang Krishnamurthy Vishwamitra',
              allocation: 25,
              category: 'Management',
              stream: 'Management',
              current_allocated_projects: ['Lecet'],
              skills: ['python', 'java'],
              experience: '34',
            },
          ],
          totalTeamSize: 9,
        },
        techStacks: ['Python', 'Langchain', 'NodeJS', 'React'],
      };
      // throw new InternalServerErrorException(
      //   'Failed to fetch data from ML model',
      // );
    }
  }

  async transformMlApiResponse(mlApiResponse: string) {
    // Split the response into lines
    const lines = mlApiResponse.split('\n');
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ lines:',
      lines[2],
    );

    // Extract values from each line
    const projectName = lines[0].split(': ')[1].trim();
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ projectName:',
      projectName,
    );
    const projectDescription = lines[1].split(': ')[1].trim();
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ projectDescription:',
      projectDescription,
    );
    const duration = lines[2].split(': ')[1].trim();
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ duration:',
      duration,
    );
    const budget = lines[3].split(': ')[1].trim();
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ budget:',
      budget,
    );
    const startDate = lines[4].split(': ')[1].trim();
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ startDate:',
      startDate,
    );

    // Extract platforms to be built
    const platformsToBeBuilt = lines
      .slice(6, lines.indexOf('Engineering Team:'))
      .map((line) => line.trim().replace(/^- /, ''));
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ platformsToBeBuilt:',
      platformsToBeBuilt,
    );

    // Extract engineering team details
    const engineeringTeam = lines
      .slice(
        lines.indexOf('Engineering Team:') + 3,
        lines.indexOf('Total Team Size:'),
      )
      .map((line) => {
        const [title, nameTag, name, allocation, companyId] = line
          .trim()
          .split(' - ')
          .map((item) => item.trim().replace(/^- /, ''));

        if (name !== undefined) {
          return {
            title,
            nameTag,
            name,
            allocation: parseInt(allocation, 10),
            companyId,
          };
        }
      })
      .filter(Boolean);
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ engineeringTeam:',
      engineeringTeam,
    );
    // Extract Total Team Size
    const totalTeamSizeIndex = lines.indexOf('Total Team Size:');
    const totalTeamSize =
      totalTeamSizeIndex !== -1
        ? parseInt(lines[totalTeamSizeIndex].split(': ')[1].trim(), 10)
        : undefined;
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ totalTeamSizeIndex:',
      totalTeamSizeIndex,
    );

    // Extract tech stacks
    const techStacks = lines
      .slice(lines.indexOf('Tech Stacks:') + 1)
      .map((line) => line.trim().replace(/^- /, ''));
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ techStacks:',
      techStacks,
    );

    // Construct the final JSON
    const result = {
      projectName,
      projectDescription,
      duration,
      budget,
      startDate,
      platformsToBeBuilt,
      engineeringTeam,
      techStacks,
    };
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ result:',
      result,
    );

    return result;
  }

  async updateProjectDetails(
    filter?: FilterQuery<Project>,
    update?: UpdateQuery<Project>,
    options?: any,
  ): Promise<ReturnType<(typeof Model)['updateOne']>> {
    return await this.projectModel.updateOne(filter, update, options).exec();
  }
  async updateProject(
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const updateQuery: any = {};

    if (updateProjectDto.team_size !== undefined) {
      updateQuery.team_size = updateProjectDto.team_size;
    }

    if (updateProjectDto.team_structure !== undefined) {
      updateQuery.team_structure = updateProjectDto.team_structure;
    }

    if (updateProjectDto.allocated_resources !== undefined) {
      updateQuery.allocated_resources = updateProjectDto.allocated_resources;
    }

    if (updateProjectDto.skills_required !== undefined) {
      updateQuery.skills_required = updateProjectDto.skills_required;
    }

    await this.updateProjectDetails({ _id: projectId }, { $set: updateQuery });
    const updatedProject = await this.getProjectById(projectId);

    return updatedProject;
  }

  // async freezeList(
  //   projectId: string,
  //   updateProjectDto: UpdateProjectDto,
  // ): Promise<Project> {
  //   try {
  //     const existingProject = await this.getProjectById(projectId);

  //     if (updateProjectDto.allocated_resources !== undefined) {
  //       const uniqueAllocatedResources =
  //         updateProjectDto.allocated_resources.filter(
  //           (resource) =>
  //             !existingProject.allocated_resources.some(
  //               (existingResource) =>
  //                 existingResource.companyId === resource.companyId,
  //             ),
  //         );

  //       // Update the project details, including unique allocated resources
  //       const result = await this.updateProjectDetails(
  //         { _id: projectId },
  //         {
  //           $push: {
  //             allocated_resources: {
  //               $each: uniqueAllocatedResources,
  //             },
  //           },
  //         },
  //       );
  //     }

  //     const updatedProject = await this.getProjectById(projectId);

  //     // Update users as per their allocation
  //     const companyIdsSet = new Set(
  //       updatedProject.allocated_resources.map((x) => x.companyId),
  //     );
  //     const uniqueCompanyIds = Array.from(companyIdsSet);

  //     for (const companyId of uniqueCompanyIds) {
  //       await this.userService.updateUserUsingCompanyId(companyId, {
  //         current_allocated_projects: [updatedProject.project_name],
  //         allocated: true,
  //       });
  //     }

  //     return updatedProject;
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException('Failed to freeze project');
  //   }
  // }

  async freezeList(projectId: string, freezeProjectDto: FreezeProjectDto) {
    const existingProject = await this.getProjectById(projectId);
    const namesSet = new Set(
      existingProject.allocated_resources.map((x) => x.name),
    );
    const uniqueNames = Array.from(namesSet);

    for (const name of uniqueNames) {
      await this.userService.updateUserUsingName(name, freezeProjectDto);
    }
  }
}
