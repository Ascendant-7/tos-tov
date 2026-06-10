import { Module } from '@nestjs/common'
import { SupabaseModule } from '../../common/supabase/supabase.module'
import { ReviewsService } from './reviews.service'
import { ReviewsController } from './reviews.controller'

@Module({
  imports: [SupabaseModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
