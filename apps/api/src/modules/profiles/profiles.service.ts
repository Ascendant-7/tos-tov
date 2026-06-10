import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'

import { SupabaseService } from '../../common/supabase/supabase.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class ProfilesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async updateById(id: string, dto: UpdateProfileDto) {
    const payload: Record<string, string> = {}

    const body = dto as unknown as {
      first_name?: unknown
      last_name?: unknown
      avatar_url?: unknown
      bio?: unknown
    }

    const firstName = body.first_name
    const lastName = body.last_name
    const avatarUrl = body.avatar_url
    const bio = body.bio

    if (typeof firstName === 'string') payload.first_name = firstName
    if (typeof lastName === 'string') payload.last_name = lastName
    if (typeof avatarUrl === 'string') payload.avatar_url = avatarUrl
    if (typeof bio === 'string') payload.bio = bio

    const { data, error } = await this.supabaseService.adminClient
      .from('profiles')
      // NOTE: Supabase generated types may not include newly added columns (avatar_url/bio)
      // until `pnpm -F @repo/supabase gen-types` is run.
      .update(payload as any)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error(`[ProfilesService] Error updating profile for ${id}`, error)
      throw new InternalServerErrorException(error.message)
    }

    if (!data) {
      throw new NotFoundException(`Profile ${id} not found`)
    }

    return data
  }

  async getById(id: string) {
    const { data, error } = await this.supabaseService.adminClient
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    console.log(`[ProfilesService] Initial fetch for id ${id}`, { data, error })

    if (error && error.code === 'PGRST116') {
      console.log(`[ProfilesService] Profile not found for ${id}, attempting auto-creation`)

      // Profile missing, try to create it from Auth data
      const { data: authData, error: authError } =
        await this.supabaseService.adminClient.auth.admin.getUserById(id)

      if (authError || !authData.user) {
        console.error(`[ProfilesService] Auth user not found for ${id}`, authError)
        throw new NotFoundException(`User ${id} not found in Auth`)
      }

      const user = authData.user
      const email = user.email
      const metadata = (user.user_metadata ?? {}) as Record<string, unknown>
      const metaFirstName =
        typeof metadata.first_name === 'string'
          ? metadata.first_name
          : typeof metadata.firstName === 'string'
            ? metadata.firstName
            : undefined
      const metaLastName =
        typeof metadata.last_name === 'string'
          ? metadata.last_name
          : typeof metadata.lastName === 'string'
            ? metadata.lastName
            : undefined

      console.log(`[ProfilesService] Creating profile for ${email} with metadata:`, metadata)

      const { data: newProfile, error: createError } = await this.supabaseService.adminClient
        .from('profiles')
        .insert({
          id,
          email,
          first_name: metaFirstName || (email ? email.split('@')[0] : 'Traveler'),
          last_name: metaLastName || '',
        })
        .select()
        .single()

      if (createError) {
        console.error(`[ProfilesService] Failed to auto-create profile for ${id}`, createError)
        throw new InternalServerErrorException(
          `Failed to auto-create profile: ${createError.message}`,
        )
      }

      console.log(`[ProfilesService] Successfully auto-created profile for ${id}`)
      return newProfile
    }

    if (error) {
      console.error(`[ProfilesService] Error fetching profile for ${id}`, error)
      throw new InternalServerErrorException(error.message)
    }

    // Backfill: if profile exists but has placeholder/missing fields, try to update from Auth metadata.
    if (data) {
      const firstNameMissing = !data.first_name || data.first_name === 'Traveler'
      const lastNameMissing = data.last_name == null
      const emailMissing = !data.email

      if (firstNameMissing || lastNameMissing || emailMissing) {
        const { data: authData, error: authError } =
          await this.supabaseService.adminClient.auth.admin.getUserById(id)

        if (!authError && authData.user) {
          const user = authData.user
          const email = user.email
          const metadata = (user.user_metadata ?? {}) as Record<string, unknown>
          const metaFirstName =
            typeof metadata.first_name === 'string'
              ? metadata.first_name
              : typeof metadata.firstName === 'string'
                ? metadata.firstName
                : undefined
          const metaLastName =
            typeof metadata.last_name === 'string'
              ? metadata.last_name
              : typeof metadata.lastName === 'string'
                ? metadata.lastName
                : undefined

          const existingFirstName =
            data.first_name && data.first_name !== 'Traveler' ? data.first_name : undefined

          const desiredFirstName =
            metaFirstName || existingFirstName || (email ? email.split('@')[0] : 'Traveler')
          const desiredLastName = metaLastName || data.last_name || ''
          const desiredEmail = email || data.email || ''

          const shouldUpdate =
            desiredFirstName !== data.first_name ||
            desiredLastName !== data.last_name ||
            desiredEmail !== data.email

          if (shouldUpdate) {
            const { data: updated, error: updateError } = await this.supabaseService.adminClient
              .from('profiles')
              .update({
                first_name: desiredFirstName,
                last_name: desiredLastName,
                email: desiredEmail,
              })
              .eq('id', id)
              .select('*')
              .single()

            if (!updateError && updated) return updated
          }
        }
      }
    }

    return data
  }

  async getStats(userId: string) {
    // 1. Get all trips for the user
    const { data: trips, error: tripsError } = await this.supabaseService.adminClient
      .from('trips')
      .select('id')
      .eq('user_id', userId)

    if (tripsError) {
      throw new InternalServerErrorException(tripsError.message)
    }

    if (!trips || trips.length === 0) {
      return {
        tripsCount: 0,
        placesCount: 0,
        countriesCount: 0,
        distanceKm: 0,
      }
    }

    const tripIds = trips.map((t) => t.id)

    // 2. Get all itinerary days for these trips
    const { data: days, error: daysError } = await this.supabaseService.adminClient
      .from('itinerary_days')
      .select('id')
      .in('trip_id', tripIds)

    if (daysError) {
      throw new InternalServerErrorException(daysError.message)
    }

    if (!days || days.length === 0) {
      return {
        tripsCount: trips.length,
        placesCount: 0,
        countriesCount: 0,
        distanceKm: 0,
      }
    }

    const dayIds = days.map((d) => d.id)

    // 3. Get all itinerary items for these days that have a destination
    const { data: items, error: itemsError } = await this.supabaseService.adminClient
      .from('itinerary_items')
      .select('destination_id')
      .in('day_id', dayIds)
      .not('destination_id', 'is', null)

    if (itemsError) {
      throw new InternalServerErrorException(itemsError.message)
    }

    const uniqueDestinations = new Set(items?.map((i) => i.destination_id) || [])

    // For now, countries count and distance are hardcoded or 0 as we don't have country/coord data yet
    return {
      tripsCount: trips.length,
      placesCount: uniqueDestinations.size,
      countriesCount: 0, // Need country data in destinations table
      distanceKm: 0,
    }
  } // Need coordinates data
  async search(query: string) {
    if (!query || !query.trim()) {
      return []
    }

    try {
      const pattern = `%${query.trim()}%`
      const { data, error } = await this.supabaseService.anonClient
        .from('profiles')
        .select('id, first_name, last_name, email')
        .or(`first_name.ilike.${pattern},last_name.ilike.${pattern},email.ilike.${pattern}`)
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
