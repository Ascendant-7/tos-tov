import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Database, SupabaseClient, createSupabaseClient } from '@repo/supabase'

@Injectable()
export class SupabaseService {
  public anonClient: SupabaseClient<Database>
  public adminClient: SupabaseClient<Database>

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL')
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY')
    const adminKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')

    if (!url || !anonKey || !adminKey) {
      throw new Error(
        'Missing Supabase credentials. Please set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in your .env file',
      )
    }

    this.anonClient = createSupabaseClient(url, anonKey)
    this.adminClient = createSupabaseClient(url, adminKey)
  }

  createUserClient(userJwt: string) {
    const url = this.configService.get<string>('SUPABASE_URL')
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY')

    if (!url || !anonKey) {
      throw new Error(
        'Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file',
      )
    }

    return createSupabaseClient(url, anonKey, {
      headers: {
        Authorization: `Bearer ${userJwt}`,
      },
    })
  }

  async testConnection() {
    const { error } = await this.anonClient.auth.getSession()
    if (error) return { msg: `error: ${error}` }
    return { msg: `ok` }
  }

  async getUserById(id: number) {
    const { data, error } = await this.anonClient.from('user').select('*').eq('id', id).single()
    if (error) return { msg: `error: ${error.message}` }
    return { msg: `ok: ${JSON.stringify(data)}` }
  }
}
