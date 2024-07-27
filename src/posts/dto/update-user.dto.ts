import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly username?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly password?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly picture?: string;
}
