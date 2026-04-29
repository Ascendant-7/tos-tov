import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  // Temporary mock login user.
  // Later, when authentication is ready, replace this with req.user.id.
  private readonly mockCurrentUserId = '11111111-1111-1111-1111-111111111111';

  @Post('request')
  sendFriendRequest(@Body() dto: SendFriendRequestDto) {
    return this.friendsService.sendFriendRequest(
      this.mockCurrentUserId,
      dto.friendId,
    );
  }

  @Post('accept/:requesterId')
  acceptFriendRequest(@Param('requesterId') requesterId: string) {
    return this.friendsService.acceptFriendRequest(
      this.mockCurrentUserId,
      requesterId,
    );
  }

  @Post('reject/:requesterId')
  rejectFriendRequest(@Param('requesterId') requesterId: string) {
    return this.friendsService.rejectFriendRequest(
      this.mockCurrentUserId,
      requesterId,
    );
  }

  @Delete(':friendId')
  removeFriend(@Param('friendId') friendId: string) {
    return this.friendsService.removeFriend(this.mockCurrentUserId, friendId);
  }

  @Get()
  getFriends() {
    return this.friendsService.getFriends(this.mockCurrentUserId);
  }

  @Get('requests/incoming')
  getIncomingRequests() {
    return this.friendsService.getIncomingRequests(this.mockCurrentUserId);
  }

  @Get('requests/outgoing')
  getOutgoingRequests() {
    return this.friendsService.getOutgoingRequests(this.mockCurrentUserId);
  }

  @Get('status/:userId')
  getFriendshipStatus(@Param('userId') userId: string) {
    return this.friendsService.getFriendshipStatus(
      this.mockCurrentUserId,
      userId,
    );
  }
}