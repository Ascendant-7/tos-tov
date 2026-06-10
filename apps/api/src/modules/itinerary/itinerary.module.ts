import { Module } from '@nestjs/common'
import { ItineraryService } from './itinerary.service'
import { ItineraryController } from './itinerary.controller'
import { SupabaseModule } from '../../common/supabase/supabase.module'

@Module({
  imports: [SupabaseModule],
  providers: [ItineraryService],
  controllers: [ItineraryController],
})
export class ItineraryModule {}
