import { IsString, IsOptional, IsInt } from 'class-validator'

export class CreateDestinationDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  province: string

  @IsOptional()
  @IsString()
  location_name?: string

  @IsString()
  category: string

  @IsOptional()
  @IsString()
  cover_image_url?: string

  @IsOptional()
  @IsInt()
  duration_min?: number

  @IsOptional()
  @IsInt()
  duration_max?: number

  @IsOptional()
  @IsInt()
  budget_min?: number

  @IsOptional()
  @IsInt()
  budget_max?: number
}
