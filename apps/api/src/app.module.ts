import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SupabaseModule } from './supabase/supabase.module'
import { AuthModule } from './modules/auth/auth.module'
import { FriendsModule } from './modules/friends/friends.module'
import { DestinationsModule } from './modules/destinations/destinations.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { ItineraryModule } from './modules/itinerary/itinerary.module'
import { BudgetModule } from './modules/budget/budget.module'
import { ProfilesModule } from './modules/profiles/profiles.module'
import { WeatherModule } from './modules/weather/weather.module'
import { FavoritesModule } from './modules/favorites/favorites.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    FriendsModule,
    BudgetModule,
    DestinationsModule,
    ReviewsModule,
    ItineraryModule,
    ProfilesModule,
    WeatherModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
