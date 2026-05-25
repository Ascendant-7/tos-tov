import { SupabaseModule } from '@/supabase/supabase.module';
import { FriendService } from './friends.service';
import { Module } from '@nestjs/common';
import { FriendController } from './friends.controller';

@Module({
  imports: [SupabaseModule],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendsModule {}
