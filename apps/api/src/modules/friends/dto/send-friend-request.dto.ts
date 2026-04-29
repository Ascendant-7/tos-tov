import { IsNotEmpty, IsUUID } from 'class-validator';

export class SendFriendRequestDto {
  @IsUUID()
  @IsNotEmpty()
  friendId: string;
}