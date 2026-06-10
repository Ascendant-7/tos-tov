import { Module } from '@nestjs/common'
import { SupabaseModule } from '../../common/supabase/supabase.module'
import { DestinationsService } from './destinations.service'
import { DestinationsController } from './destinations.controller'

@Module({
  imports: [SupabaseModule],
  controllers: [DestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}
