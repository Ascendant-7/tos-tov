import { Module } from '@nestjs/common'

import { SupabaseModule } from '../../common/supabase/supabase.module'

import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'

@Module({
  imports: [SupabaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
