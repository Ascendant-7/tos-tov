import { Injectable } from '@nestjs/common';
import { Database } from '@repo/supabase';
import { SupabaseClient } from '@repo/supabase';
import { createSupabaseClient } from '@repo/supabase';

@Injectable()
export class SupabaseService {
  public readonly client: SupabaseClient<Database>;

  constructor() {
    this.client = createSupabaseClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );
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
