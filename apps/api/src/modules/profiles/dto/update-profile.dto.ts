import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  first_name?: string

  @IsOptional()
  @IsString()
  last_name?: string

  @IsOptional()
  @IsUrl()
  avatar_url?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string
}
