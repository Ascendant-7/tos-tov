import { IsIn } from 'class-validator'

export class UpdatePostVisibilityDto {
  @IsIn(['public', 'friends', 'private'])
  visibility: 'public' | 'friends' | 'private'
}
