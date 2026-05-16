import { IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
