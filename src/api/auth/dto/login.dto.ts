import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString({ message: 'email should be string value' })
  @IsNotEmpty({ message: 'Email cant be empty' })
  @Transform(({ value }: TransformFnParams) => value?.toLowerCase().trim())
  readonly email: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString({ message: 'Password should be string value' })
  @IsNotEmpty({ message: 'Password cant be empty' })
  readonly password: string;
}
