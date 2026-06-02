import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'

import { SupabaseService } from '../../supabase/supabase.service'

@Injectable()
export class ProfilesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getById(id: string) {
    const { data, error } = await this.supabaseService.anonClient
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Profile ${id} not found`)
      }

      throw new InternalServerErrorException(error.message)
    }

    return data
  }

  async search(query: string) {
    if (!query || !query.trim()) {
      return []
    }

    try {
      const pattern = `%${query.trim()}%`
      const { data, error } = await this.supabaseService.anonClient
        .from('profiles')
        .select('id, first_name, last_name, email')
        .or(
          `first_name.ilike.${pattern},last_name.ilike.${pattern},email.ilike.${pattern}`,
        )
        .limit(10)

      if (error) {
        console.error('[ProfilesService] search error:', error)
        return []
      }

      return data ?? []
    } catch (err) {
      console.error('[ProfilesService] unexpected search error:', err)
      return []
    }
  }
}
