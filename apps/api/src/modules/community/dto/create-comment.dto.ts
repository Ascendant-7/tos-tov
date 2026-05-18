import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}