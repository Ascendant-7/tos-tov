import { Injectable } from '@nestjs/common';
import { Database, SupabaseClient, createSupabaseClient } from '@repo/supabase';

@Injectable()
export class SupabaseService {
  public readonly client: SupabaseClient<Database>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

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
