import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDraftPostDto {
  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsIn(['visited', 'want_to_go', 'planned'])
  visitStatus?: 'visited' | 'want_to_go' | 'planned';

  @IsOptional()
  @IsIn(['public', 'friends', 'private'])
  visibility?: 'public' | 'friends' | 'private';
}
