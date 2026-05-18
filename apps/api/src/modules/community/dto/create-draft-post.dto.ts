import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDraftPostDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsIn(['visited', 'want_to_go', 'planned'])
  visitStatus?: 'visited' | 'want_to_go' | 'planned';

  @IsOptional()
  @IsIn(['public', 'friends', 'private'])
  visibility?: 'public' | 'friends' | 'private';
}