import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FriendService } from './friends.service';

function requireAccessToken(authHeader?: string) {
  if (!authHeader) {
    throw new BadRequestException('Missing Authorization header');
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new BadRequestException('Invalid Authorization header');
  }

  return token;
}

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get('overview')
  getOverview(@Headers('authorization') authHeader: string) {
    return this.friendService.getOverview(requireAccessToken(authHeader));
  }

  @Get('travelers/search')
  searchTravelers(
    @Headers('authorization') authHeader: string,
    @Query('q') q?: string,
  ) {
    return this.friendService.searchTravelers(
      requireAccessToken(authHeader),
      q,
    );
  }

  @Post('requests/:targetUserId')
  sendFriendRequest(
    @Headers('authorization') authHeader: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.friendService.sendFriendRequest(
      requireAccessToken(authHeader),
      targetUserId,
    );
  }

  @Patch('requests/:requestId/accept')
  acceptFriendRequest(
    @Headers('authorization') authHeader: string,
    @Param('requestId') requestId: string,
  ) {
    return this.friendService.acceptFriendRequest(
      requireAccessToken(authHeader),
      requestId,
    );
  }

  @Patch('requests/:requestId/reject')
  rejectFriendRequest(
    @Headers('authorization') authHeader: string,
    @Param('requestId') requestId: string,
  ) {
    return this.friendService.rejectFriendRequest(
      requireAccessToken(authHeader),
      requestId,
    );
  }

  @Delete('requests/:requestId/cancel')
  cancelFriendRequest(
    @Headers('authorization') authHeader: string,
    @Param('requestId') requestId: string,
  ) {
    return this.friendService.cancelFriendRequest(
      requireAccessToken(authHeader),
      requestId,
    );
  }

  @Delete(':friendshipId')
  removeFriend(
    @Headers('authorization') authHeader: string,
    @Param('friendshipId') friendshipId: string,
  ) {
    return this.friendService.removeFriend(
      requireAccessToken(authHeader),
      friendshipId,
    );
  }
}
