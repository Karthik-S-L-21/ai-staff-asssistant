import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ProjectsParamDto {
  @IsNotEmpty({ message: 'Projects Id is empty' })
  @IsMongoId({ message: 'Projects Id is Invalid' })
  id: string;
}
