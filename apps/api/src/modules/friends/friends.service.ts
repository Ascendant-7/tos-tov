import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {FRIENDS_REPOSITORY} from './repositories/friends.repository.interface';
import { FriendshipStatus } from './model/friendship-status.enum';
import type { FriendsRepository } from './repositories/friends.repository.interface';
@Injectable()
export class FriendsService {
  constructor(
    @Inject(FRIENDS_REPOSITORY)
    private readonly friendsRepository: FriendsRepository,
  ) {}

  async sendFriendRequest(currentUserId: string, friendId: string) {
    if (currentUserId === friendId) {
      throw new BadRequestException(
        'You cannot send a friend request to yourself',
      );
    }

    const existingFriendship = await this.friendsRepository.findFriendship(
      currentUserId,
      friendId,
    );

    if (existingFriendship) {
      throw new ConflictException('Friendship or friend request already exists');
    }

    return this.friendsRepository.createFriendRequest(currentUserId, friendId);
  }

  async acceptFriendRequest(currentUserId: string, requesterId: string) {
    const friendship = await this.friendsRepository.findFriendship(
      requesterId,
      currentUserId,
    );

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendship.friend_id !== currentUserId) {
      throw new BadRequestException('You can only accept requests sent to you');
    }

    if (friendship.status !== FriendshipStatus.Pending) {
      throw new BadRequestException('Friend request is not pending');
    }

    return this.friendsRepository.updateFriendshipStatus(
      requesterId,
      currentUserId,
      FriendshipStatus.Accepted,
    );
  }

  async rejectFriendRequest(currentUserId: string, requesterId: string) {
    const friendship = await this.friendsRepository.findFriendship(
      requesterId,
      currentUserId,
    );

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendship.friend_id !== currentUserId) {
      throw new BadRequestException('You can only reject requests sent to you');
    }

    if (friendship.status !== FriendshipStatus.Pending) {
      throw new BadRequestException('Friend request is not pending');
    }

    return this.friendsRepository.updateFriendshipStatus(
      requesterId,
      currentUserId,
      FriendshipStatus.Rejected,
    );
  }

  async removeFriend(currentUserId: string, friendId: string) {
    const friendship = await this.friendsRepository.findFriendship(
      currentUserId,
      friendId,
    );

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    await this.friendsRepository.deleteFriendship(currentUserId, friendId);

    return {
      message: 'Friend removed successfully',
    };
  }

  async getFriends(currentUserId: string) {
    return this.friendsRepository.findFriends(currentUserId);
  }

  async getIncomingRequests(currentUserId: string) {
    return this.friendsRepository.findIncomingRequests(currentUserId);
  }

  async getOutgoingRequests(currentUserId: string) {
    return this.friendsRepository.findOutgoingRequests(currentUserId);
  }

  async getFriendshipStatus(currentUserId: string, otherUserId: string) {
    const friendship = await this.friendsRepository.findFriendship(
      currentUserId,
      otherUserId,
    );

    if (!friendship) {
      return {
        status: 'none',
      };
    }

    return {
      status: friendship.status,
      friendship,
    };
  }
}