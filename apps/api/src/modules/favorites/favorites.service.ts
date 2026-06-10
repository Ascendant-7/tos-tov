import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { SupabaseService } from '../../common/supabase/supabase.service'

@Injectable()
export class FavoritesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get all favorited destinations for a user, with full destination data.
   * NOTE: The 'favorites' table may not exist in Supabase generated types yet.
   * We cast to `any` like other services do for newly-added tables.
   */
  async getFavorites(userId: string) {
    const { data, error } = await (this.supabaseService.adminClient as any)
      .from('favorites')
      .select('id, created_at, destination_id, destinations(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[FavoritesService] getFavorites error:', error)
      throw new InternalServerErrorException(error.message)
    }

    return data ?? []
  }

  /**
   * Add a destination to the user's favorites.
   * Uses upsert to gracefully handle duplicate inserts.
   */
  async addFavorite(userId: string, destinationId: string) {
    const { data, error } = await (this.supabaseService.adminClient as any)
      .from('favorites')
      .upsert(
        { user_id: userId, destination_id: destinationId },
        { onConflict: 'user_id,destination_id' },
      )
      .select('id, created_at, destination_id, destinations(*)')
      .single()

    if (error) {
      console.error('[FavoritesService] addFavorite error:', error)
      throw new InternalServerErrorException(error.message)
    }

    return data
  }

  /**
   * Remove a destination from the user's favorites.
   */
  async removeFavorite(userId: string, destinationId: string) {
    const { error } = await (this.supabaseService.adminClient as any)
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId)

    if (error) {
      console.error('[FavoritesService] removeFavorite error:', error)
      throw new InternalServerErrorException(error.message)
    }

    return { message: 'Favorite removed successfully' }
  }

  /**
   * Check if a destination is favorited by the user.
   */
  async isFavorited(userId: string, destinationId: string) {
    const { data, error } = await (this.supabaseService.adminClient as any)
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('destination_id', destinationId)
      .maybeSingle()

    if (error) {
      console.error('[FavoritesService] isFavorited error:', error)
      throw new InternalServerErrorException(error.message)
    }

    return { isFavorited: !!data }
  }
}
