import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import {
  FRIENDS_REPOSITORY,
} from './repositories/friends.repository.interface';
import { MockFriendsRepository } from './repositories/mock-friends.repository';

@Module({
  controllers: [FriendsController],
  providers: [
    FriendsService,
    {
      provide: FRIENDS_REPOSITORY,
      useClass: MockFriendsRepository,
    },
  ],
  exports: [FriendsService],
})
export class FriendsModule {}