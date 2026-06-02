import { IsOptional, IsString } from 'class-validator'

export class CreateItineraryDayDto {
  @IsString()
  @IsOptional()
  title?: string
}
