import { Friendship } from '../model/friendship.model';
import { FriendshipStatus } from '../model/friendship-status.enum';

export const FRIENDS_REPOSITORY = 'FRIENDS_REPOSITORY';

export interface FriendsRepository {
  findFriendship(userId: string, friendId: string): Promise<Friendship | null>;

  createFriendRequest(userId: string, friendId: string): Promise<Friendship>;

  updateFriendshipStatus(
    userId: string,
    friendId: string,
    status: FriendshipStatus,
  ): Promise<Friendship>;

  deleteFriendship(userId: string, friendId: string): Promise<void>;

  findFriends(userId: string): Promise<Friendship[]>;

  findIncomingRequests(userId: string): Promise<Friendship[]>;

  findOutgoingRequests(userId: string): Promise<Friendship[]>;
}