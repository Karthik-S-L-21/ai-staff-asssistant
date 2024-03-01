import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AllocatedResourceDto, TeamStructureDto } from './add-project.dto';

export class UpdateProjectDto {
  @IsOptional()
  @IsNumber()
  team_size?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamStructureDto)
  team_structure?: TeamStructureDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllocatedResourceDto)
  allocated_resources?: AllocatedResourceDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills_required?: string[];
}
