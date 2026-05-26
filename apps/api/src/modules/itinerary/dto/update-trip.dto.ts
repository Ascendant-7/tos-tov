import { IsIn, IsOptional, IsString } from 'class-validator'

export class UpdateTripDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsIn(['private', 'public'])
  @IsOptional()
  visibility?: 'private' | 'public'
}
