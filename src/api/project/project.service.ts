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
import { Category, positionToCategoryMap } from './constants/project-constants';
import { FreezeProjectDto } from './dto/freeze_list.dto';
import { UserStream } from '../user/enums/user-designation.enum';

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
        project_allocation_status: 1,
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
        project_allocation_status: addProjectDto.project_allocation_status,
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
      console.log(
        '🚀 ~ ProjectService ~ initiateAllocation ~ projectDetails:',
        projectDetails,
      );

      const url = constructURLWithSearchParameter(mlUrl, {
        project_name: projectDetails.project_name,
        project_description: projectDetails.short_description,
        platforms: projectDetails.platforms_to_be_built
          // .map((platform) => ` - ${platform}`)
          .join(','),
        duration: projectDetails.duration,
        budget: projectDetails.estimated_budget,
        start_date: '03/03/2024',
        skills_preferred: projectDetails.skills_preferred.join(','),
      });

      console.log(url);
      // Make a request to the ML API
      const mlApiResponse = await firstValueFrom(this.httpService.post(url));
      const mlResponseData = mlApiResponse.data;

      console.log('hereeee..........', JSON.parse(mlResponseData));
      return JSON.parse(mlResponseData);
    } catch (error) {
      console.log('🚀 ~ ProjectService ~ initiateAllocation ~ error:', error);

      //dummy data for timebeing
      // return {
      //   projectName: 'Gen AI POC',
      //   projectDescription:
      //     'This is a proof-of-concept project aimed at exploring the capabilities of Gen AI.',
      //   duration: '6 Months',
      //   budget: '$0.25M',
      //   startDate: '06-30-2024',
      //   platformsToBeBuilt: ['Web', 'Backend'],
      //   engineeringTeam: {
      //     teamStructure: [
      //       {
      //         title: 'Frontend Lead (FE Lead)',
      //         name: 'Suchak Mihir Dinkarray',
      //         allocation: 100,
      //         category: 'Frontend',
      //         stream: 'Technology',
      //         current_allocated_projects: ['Loreal'],
      //         skills: ['python', 'java'],
      //         experience: '17',
      //       },
      //       {
      //         title: 'Frontend Software Engineer (FE SE)',
      //         name: 'Raghav Sharma',
      //         allocation: 100,
      //         category: 'Frontend',
      //         stream: 'Technology',
      //         current_allocated_projects: ['Loreal'],
      //         skills: ['python', 'java'],
      //         experience: '17',
      //       },
      //       {
      //         title: 'Backend Lead (BE Lead)',
      //         name: 'Srijita Thakur',
      //         allocation: 50,
      //         category: 'Backend',
      //         stream: 'Technology',
      //         current_allocated_projects: ['Loreal'],
      //         skills: ['python', 'java'],
      //         experience: '17',
      //       },
      //       {
      //         title: 'Backend Associate Software Engineer (BE ASE)',
      //         name: 'Bandhan Roy',
      //         allocation: 100,
      //         category: 'Backend',
      //         stream: 'Technology',
      //         current_allocated_projects: ['Loreal'],
      //         skills: ['python', 'java'],
      //         experience: '31',
      //       },
      //       {
      //         title: 'Quality Engineer (QA SSE)',
      //         name: 'Aishwarya Chandrakant Madiwal',
      //         allocation: 100,
      //         category: 'QA',
      //         stream: 'QualityAssurance',
      //         current_allocated_projects: ['Loreal'],
      //         skills: ['python', 'java'],
      //         experience: '22',
      //       },
      //       {
      //         title: 'Engineering Manager',
      //         name: 'Vinay S',
      //         allocation: 50,
      //         category: 'Management',
      //         stream: 'Management',
      //         current_allocated_projects: ['Loreal'],
      //         skills: ['python', 'java'],
      //         experience: '17',
      //       },
      //       {
      //         title: 'Project Manager',
      //         name: 'Maryam Fatima',
      //         allocation: 100,
      //         category: 'Management',
      //         stream: 'Management',
      //         current_allocated_projects: ['Lecet'],
      //         skills: ['python', 'java'],
      //         experience: '19',
      //       },
      //       {
      //         title: 'Product Manager',
      //         name: 'Pallavi Tandan',
      //         allocation: 50,
      //         category: 'Management',
      //         stream: 'Management',
      //         current_allocated_projects: ['Lecet'],
      //         skills: ['python', 'java'],
      //         experience: '28',
      //       },
      //       {
      //         title: 'Director of Engineering',
      //         name: 'Shubhang Krishnamurthy Vishwamitra',
      //         allocation: 25,
      //         category: 'Management',
      //         stream: 'Management',
      //         current_allocated_projects: ['Lecet'],
      //         skills: ['python', 'java'],
      //         experience: '34',
      //       },
      //     ],
      //     totalTeamSize: 9,
      //   },
      //   techStacks: ['Python', 'Langchain', 'NodeJS', 'React'],
      // };
      throw new InternalServerErrorException(
        'Failed to fetch data from ML model',
      );
    }
  }

  async transformMlApiResponse(mlApiResponse: string) {
    // Split the response into lines
    const lines = mlApiResponse.split('\n').filter((st) => st.length && st);
    console.log('🚀 ~ ProjectService ~ transformMlApiResponse ~ lines:', lines);

    // Extract values from each line
    const projectName = lines[0].split(': ')[1].trim();
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ projectName:',
      projectName,
    );
    const projectDescription = lines[1].split(': ')[1]?.trim();
    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ projectDescription:',
      projectDescription,
    );
    console.log(lines[2]);
    const duration = lines[2].split(': ')[1].trim();
    // console.log(
    //   '🚀 ~ ProjectService ~ transformMlApiResponse ~ duration:',
    //   duration,
    // );
    const budget = lines[3].split(': ')[1].trim();
    // console.log(
    //   '🚀 ~ ProjectService ~ transformMlApiResponse ~ budget:',
    //   budget,
    // );
    const startDate = lines[4].split(': ')[1].trim();
    // console.log(
    //   '🚀 ~ ProjectService ~ transformMlApiResponse ~ startDate:',
    //   startDate,
    // );

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
        // Check if the line has the expected structure
        if (!line.includes(' - ')) {
          return null; // Skip lines that don't have the expected structure
        }

        const [rawTitle, nameTag, rest] = line.trim().split(' - ');

        // Remove leading hyphen from the title
        const title = rawTitle.replace(/^- /, '');

        // Check if rest contains parentheses
        const hasParentheses = /\((.+?)\)/.test(rest);

        // If it doesn't contain parentheses, consider the whole rest as the name
        if (!hasParentheses) {
          const name = rest?.trim();
          if (name !== '') {
            // Check if name is not an empty string
            return {
              title,
              nameTag,
              name,
              allocation: undefined,
              companyId: undefined,
              stream: undefined,
              category: undefined,
            };
          }
        }

        // If it contains parentheses, extract name and allocation
        const [name, allocationStr] =
          rest
            .match(/(.+?)\((.+?)\)/)
            ?.slice(1)
            .map((item) => item?.trim()) || [];

        // Check if the name is present and not an empty string
        if (name !== undefined && name !== '') {
          // Convert allocation percentage to a number
          const allocation = parseFloat(allocationStr);

          // Assign stream and category based on the title
          let stream;
          let category;

          switch (title) {
            case 'Frontend Lead (FE Lead)':
            case 'Frontend Software Engineer (FE SE)':
            case 'Frontend Senior Software Engineer (FE SSE)':
            case 'Frontend Associate Software Engineer (FE ASE)':
              stream = UserStream.FE;
              category = Category.Technology;
              break;
            case 'Backend Lead (FE Lead)':
            case 'Backend Software Engineer (FE SE)':
            case 'Backend Senior Software Engineer (FE SSE)':
            case 'Backend Associate Software Engineer (FE ASE)':
              stream = UserStream.BE;
              category = Category.Technology;
              break;
            case 'Quality Engineer (QA SSE)':
              stream = UserStream.QA;
              category = Category.Technology;
              break;
            case 'Project Manager':
            case 'Director of Engineering':
            case 'Engineering Manager':
            case 'Senior Engineering Manager':
            case 'Product Manager':
            case 'Product Owner':
              stream = UserStream.Management;
              category = Category.ProductStrategy;
              break;
            case 'Machine Learning Engineer (MLE)':
              stream = UserStream.ML;
              category = Category.Technology;
              break;
            default:
              stream = UserStream.Management;
              category = Category.Technology;
          }

          return {
            title,
            nameTag,
            name,
            allocation: isNaN(allocation) ? undefined : allocation,
            companyId: undefined,
            stream,
            category,
          };
        }

        return null; // Skip entries without a valid name
      })
      .filter((entry) => entry !== null && entry.name !== undefined); // Remove null entries

    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ engineeringTeam:',
      engineeringTeam,
    );

    console.log(
      '🚀 ~ ProjectService ~ transformMlApiResponse ~ engineeringTeam:',
      engineeringTeam,
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

  async addToProject(
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    try {
      const existingProject = await this.getProjectById(projectId);

      if (updateProjectDto.allocated_resources !== undefined) {
        const uniqueAllocatedResources =
          updateProjectDto.allocated_resources.filter(
            (resource) =>
              !existingProject.allocated_resources.some(
                (existingResource) =>
                  existingResource.companyId === resource.companyId,
              ),
          );

        // Update the project details, including unique allocated resources
        const result = await this.updateProjectDetails(
          { _id: projectId },
          {
            $push: {
              allocated_resources: {
                $each: uniqueAllocatedResources,
              },
            },
          },
        );
      }

      const updatedProject = await this.getProjectById(projectId);

      // Update users as per their allocation
      const companyIdsSet = new Set(
        updatedProject.allocated_resources.map((x) => x.companyId),
      );
      const uniqueCompanyIds = Array.from(companyIdsSet);

      for (const companyId of uniqueCompanyIds) {
        await this.userService.updateUserUsingCompanyId(companyId, {
          current_allocated_projects: [updatedProject.project_name],
          allocated: true,
        });
      }

      return updatedProject;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to freeze project');
    }
  }

  async freezeList(projectId: string, freezeProjectDto: FreezeProjectDto) {
    const existingProject = await this.getProjectById(projectId);
    const namesSet = new Set(
      freezeProjectDto.allocated_resources.map((x) => x?.name),
    );
    const uniqueNames = Array.from(namesSet);

    for (const name of uniqueNames) {
      await this.userService.updateUserUsingName(name, freezeProjectDto);
    }
  }
}

/**
 * method only formats for path parameters
 * search or query parameter does not work
 * @param rawURL the raw string url
 * @param pathParamObject the path param object that needs to be dynamically replaced
 * @returns string
 */
const returnFormattedURL = (
  rawURL: string,
  pathParamObject?: Record<string, string>,
): string => {
  if (!pathParamObject) return rawURL;
  Object.keys(pathParamObject).forEach((constraint) => {
    pathParamObject[constraint] &&
      (rawURL = rawURL.replace(
        new RegExp(`{${constraint}}`, 'g'),
        pathParamObject[constraint],
      ));
  });
  return rawURL;
};

/**
 * method appends the search parameters to the URL
 * @param rawURL the raw string url
 * @param pathParamObject the path param object that needs to be dynamically replaced
 * @returns string
 */
const constructURLWithSearchParameter = (
  rawURL: string,
  searchParameterObject: Record<string, string | number | string[]>,
): string => {
  Object.keys(searchParameterObject).forEach((key, index) => {
    rawURL += `${index === 0 ? '?' : '&'}`;
    if (Array.isArray(searchParameterObject[key])) {
      (searchParameterObject[key] as string[]).forEach((data, index) => {
        rawURL += `${index === 0 ? '' : '&'}${key}[]=${data}`;
      });
    } else rawURL += `${key}=${searchParameterObject[key]}`;
  });
  return rawURL;
};

export const httpUtil = {
  returnFormattedURL,
  constructURLWithSearchParameter,
};
