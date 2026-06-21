import { IsString, IsOptional, IsInt, IsNumber, IsBoolean } from 'class-validator'

export class CreateDestinationDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  province!: string

  @IsOptional()
  @IsString()
  location_name?: string

  @IsOptional()
  @IsNumber()
  latitude?: number

  @IsOptional()
  @IsNumber()
  longitude?: number

  @IsString()
  category!: string

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

  @IsOptional()
  @IsBoolean()
  is_hidden_gem?: boolean
}
