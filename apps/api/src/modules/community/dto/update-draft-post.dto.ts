<<<<<<< HEAD
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
=======
import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
>>>>>>> 62f821d (feat/Community: posts,comments,likes,saves,drafting and published posts)

export class UpdateDraftPostDto {
  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @IsOptional()
  @IsString()
<<<<<<< HEAD
=======
  @IsNotEmpty()
>>>>>>> 62f821d (feat/Community: posts,comments,likes,saves,drafting and published posts)
  title?: string;

  @IsOptional()
  @IsString()
<<<<<<< HEAD
=======
  @IsNotEmpty()
>>>>>>> 62f821d (feat/Community: posts,comments,likes,saves,drafting and published posts)
  content?: string;

  @IsOptional()
  @IsIn(['visited', 'want_to_go', 'planned'])
  visitStatus?: 'visited' | 'want_to_go' | 'planned';

  @IsOptional()
  @IsIn(['public', 'friends', 'private'])
  visibility?: 'public' | 'friends' | 'private';
}