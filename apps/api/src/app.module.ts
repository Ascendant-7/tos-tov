import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { BudgetModule } from './budget/budget.module';

@Module({
  imports: [SupabaseModule, BudgetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}