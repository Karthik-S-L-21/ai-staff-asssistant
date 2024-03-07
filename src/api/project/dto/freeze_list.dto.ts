import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { AllocatedResourceDto } from './add-project.dto';

export class FreezeProjectDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllocatedResourceDto)
  allocated_resources?: AllocatedResourceDto[];
}
