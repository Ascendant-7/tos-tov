import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [CommunityController],
  providers: [CommunityService, AuthGuard],
})
export class CommunityModule {}
