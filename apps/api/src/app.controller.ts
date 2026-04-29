import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private supabaseService: SupabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-connection')
  testConnection() {
    return this.supabaseService.testConnection();
  }
  @Get('user/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.supabaseService.getUserById(id);
  }
}
