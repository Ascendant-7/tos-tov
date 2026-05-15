import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Database, SupabaseClient, createSupabaseClient } from '@repo/supabase';

@Injectable()
export class SupabaseService {
  public client: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file',
      );
    }

    this.client = createSupabaseClient(supabaseUrl, supabaseKey);
  }

  async testConnection() {
    const { error } = await this.client.auth.getSession();
    if (error) return { msg: `error: ${error}` };
    return { msg: `ok` };
  }

  async getUserById(id: number) {
    const { data, error } = await this.client
      .from('user')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return { msg: `error: ${error.message}` };
    return { msg: `ok: ${JSON.stringify(data)}` };
  }
}
