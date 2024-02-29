// update-user.dto.ts

import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserDesignation, UserStream } from '../enums/user-designation.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsEnum(UserDesignation)
  designation?: UserDesignation;

  @IsOptional()
  @IsEnum(UserStream)
  stream?: UserStream;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsBoolean()
  allocated?: boolean;

  @IsOptional()
  @IsArray()
  current_allocated_projects?: string[];

  @IsOptional()
  @IsNumber()
  allocated_percentage?: number;

  @IsOptional()
  @IsArray()
  primary_skill?: string[];

  @IsOptional()
  @IsArray()
  secondary_skill?: string[];

  @IsOptional()
  @IsString()
  role?: string;
}
