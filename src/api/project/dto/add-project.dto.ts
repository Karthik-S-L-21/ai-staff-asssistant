import {
  IsDate,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Platforms, ProjectStatus } from '../enums/project.enum';
import { UserDesignation } from '../../user/enums/user-designation.enum';

export class TeamStructureDto {
  @IsEnum(UserDesignation)
  title: string;

  @IsNumber()
  allocation: number;
}

export class AllocatedResourceDto {
  @IsString()
  name: string;

  @IsEnum(UserDesignation)
  designation: string;

  @IsNumber()
  allocation_percentage: number;

  @IsString()
  companyId: string;
}

export class AddProjectDto {
  @IsString()
  project_name: string;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @IsString()
  duration: string;

  @IsString()
  estimated_budget: string;

  @IsString()
  short_description: string;

  @IsEnum(ProjectStatus)
  project_status: string;

  @IsArray()
  @IsString({ each: true })
  skills_preferred: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills_required: string[];

  @IsEnum(Platforms, { each: true })
  platforms_to_be_built: Platforms[];

  @IsOptional()
  @IsNumber()
  team_size: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamStructureDto)
  team_structure: TeamStructureDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllocatedResourceDto)
  allocated_resources: AllocatedResourceDto[];

  //   @IsDate()
  //   createdAt: Date;

  //   @IsDate()
  //   updatedAt: Date;
}
