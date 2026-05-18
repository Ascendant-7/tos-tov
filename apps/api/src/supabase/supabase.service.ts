import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Database, SupabaseClient, createSupabaseClient } from '@repo/supabase';

@Injectable()
export class SupabaseService {
  public anonClient: SupabaseClient<Database>;
  public adminClient: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseAdminKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !supabaseAnonKey || !supabaseAdminKey) {
      throw new Error(
        'Missing Supabase credentials. Please set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in your .env file',
      );
    }

    this.anonClient = createSupabaseClient(supabaseUrl, supabaseAnonKey);
    this.adminClient = createSupabaseClient(supabaseUrl, supabaseAdminKey);
  }

  createUserClient(userJwt: string) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file',
      );
    }

    return createSupabaseClient(supabaseUrl, supabaseKey, {
      headers: `Bearer ${userJwt}`,
    } as Record<string, string>);
  }

  async testConnection() {
    const { error } = await this.anonClient.auth.getSession();
    if (error) return { msg: `error: ${error}` };
    return { msg: `ok` };
  }

  async getUserById(id: number) {
    const { data, error } = await this.anonClient
      .from('user')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return { msg: `error: ${error.message}` };
    return { msg: `ok: ${JSON.stringify(data)}` };
  }
}
