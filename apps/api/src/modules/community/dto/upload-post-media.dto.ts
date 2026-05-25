import { IsNumberString, IsOptional } from 'class-validator';

export class UploadPostMediaDto {
  @IsOptional()
  @IsNumberString()
  position?: string;
}
