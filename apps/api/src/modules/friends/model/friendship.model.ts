import { FriendshipStatus } from './friendship-status.enum';

export interface Friendship {
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
}