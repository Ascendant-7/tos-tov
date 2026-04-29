import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendsRepository } from './friends.repository.interface';
import { Friendship } from '../model/friendship.model';
import { FriendshipStatus } from '../model/friendship-status.enum';

@Injectable()
export class MockFriendsRepository implements FriendsRepository {
  private friendships: Friendship[] = [
    {
      user_id: '11111111-1111-1111-1111-111111111111',
      friend_id: '22222222-2222-2222-2222-222222222222',
      status: FriendshipStatus.Accepted,
    },
    {
      user_id: '33333333-3333-3333-3333-333333333333',
      friend_id: '11111111-1111-1111-1111-111111111111',
      status: FriendshipStatus.Pending,
    },
  ];

  async findFriendship(
    userId: string,
    friendId: string,
  ): Promise<Friendship | null> {
    const friendship = this.friendships.find(
      (item) =>
        (item.user_id === userId && item.friend_id === friendId) ||
        (item.user_id === friendId && item.friend_id === userId),
    );

    return friendship ?? null;
  }

  async createFriendRequest(
    userId: string,
    friendId: string,
  ): Promise<Friendship> {
    const newFriendship: Friendship = {
      user_id: userId,
      friend_id: friendId,
      status: FriendshipStatus.Pending,
    };

    this.friendships.push(newFriendship);

    return newFriendship;
  }

  async updateFriendshipStatus(
    userId: string,
    friendId: string,
    status: FriendshipStatus,
  ): Promise<Friendship> {
    const friendship = await this.findFriendship(userId, friendId);

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    friendship.status = status;

    return friendship;
  }

  async deleteFriendship(userId: string, friendId: string): Promise<void> {
    this.friendships = this.friendships.filter(
      (item) =>
        !(
          (item.user_id === userId && item.friend_id === friendId) ||
          (item.user_id === friendId && item.friend_id === userId)
        ),
    );
  }

  async findFriends(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (item) =>
        item.status === FriendshipStatus.Accepted &&
        (item.user_id === userId || item.friend_id === userId),
    );
  }

  async findIncomingRequests(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (item) =>
        item.friend_id === userId &&
        item.status === FriendshipStatus.Pending,
    );
  }

  async findOutgoingRequests(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (item) =>
        item.user_id === userId &&
        item.status === FriendshipStatus.Pending,
    );
  }
}