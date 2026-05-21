import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { SupabaseService } from '../../supabase/supabase.service'
import { CreateTripDto } from './dto/create-trip.dto'
import { CreateItineraryDayDto } from './dto/create-itinerary-day.dto'
import { CreateItineraryItemDto } from './dto/create-itinerary-item.dto'
import { UpdateTripDto } from './dto/update-trip.dto'
import { UpdateItineraryItemDto } from './dto/update-itinerary-item.dto'

@Injectable()
export class ItineraryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get db() {
    return this.supabaseService.adminClient as any
  }

  private readonly itemSelect = `
    *,
    destination:destinations (
      id,
      name,
      cover_image_url,
      province,
      category
    )
  `

  private async getTripForAccess(tripId: string) {
    const { data, error } = await this.db
      .from('trips')
      .select('id, user_id, visibility')
      .eq('id', tripId)
      .single()

    if (error || !data) {
      throw new NotFoundException('Trip not found')
    }

    return data as { id: string; user_id: string | null; visibility: string | null }
  }

  private async ensureTripViewable(tripId: string, userId?: string) {
    const trip = await this.getTripForAccess(tripId)

    if (trip.user_id !== userId && trip.visibility !== 'public') {
      throw new ForbiddenException('You do not have access to this trip')
    }

    return trip
  }

  private async ensureTripOwner(tripId: string, userId: string) {
    const trip = await this.getTripForAccess(tripId)

    if (trip.user_id !== userId) {
      throw new ForbiddenException('Only the trip owner can edit this trip')
    }

    return trip
  }

  private async ensureDayOwner(dayId: string, userId: string) {
    const { data, error } = await this.supabaseService.adminClient
      .from('itinerary_days')
      .select('id, trip_id')
      .eq('id', dayId)
      .single()

    if (error || !data) {
      throw new NotFoundException('Itinerary day not found')
    }

    await this.ensureTripOwner(data.trip_id, userId)
    return data
  }

  private async ensureItemOwner(itemId: string, userId: string) {
    const { data, error } = await this.supabaseService.adminClient
      .from('itinerary_items')
      .select('id, day_id')
      .eq('id', itemId)
      .single()

    if (error || !data) {
      throw new NotFoundException('Itinerary item not found')
    }

    await this.ensureDayOwner(data.day_id, userId)
    return data
  }

  async createTrip(dto: CreateTripDto, userId: string) {
    const { data, error } = await this.db
      .from('trips')
      .insert({
        title: dto.title,
        description: dto.description || null,
        user_id: userId,
        visibility: 'private',
      })
      .select('*')
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async getTrips(userId: string) {
    const { data, error } = await this.db
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  async getSharedTrips() {
    const { data, error } = await this.db
      .from('trips')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  async updateTrip(tripId: string, dto: UpdateTripDto, userId: string) {
    await this.ensureTripOwner(tripId, userId)

    const { data, error } = await this.db
      .from('trips')
      .update({
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.visibility !== undefined ? { visibility: dto.visibility } : {}),
      })
      .eq('id', tripId)
      .select('*')
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async getItinerary(tripId: string, userId?: string) {
    const trip = await this.ensureTripViewable(tripId, userId)

    const { data: tripDays, error: daysError } = await this.supabaseService.adminClient
      .from('itinerary_days')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true })

    if (daysError) {
      throw new Error(daysError.message)
    }

    const days = tripDays || []

    const result: Array<{ items: any[] }> = []

    for (const day of days) {
      const { data: items, error: itemsError } = await this.supabaseService.adminClient
        .from('itinerary_items')
        .select(this.itemSelect)
        .eq('day_id', day.id)
        .order('position', { ascending: true })

      if (itemsError) {
        throw new Error(itemsError.message)
      }

      result.push({
        ...day,
        items,
      })
    }

    return {
      trip: {
        id: trip.id,
        user_id: trip.user_id,
        visibility: trip.visibility,
        can_edit: trip.user_id === userId,
      },
      days: result,
    }
  }

  async createDay(tripId: string, dto: CreateItineraryDayDto, userId: string) {
    await this.ensureTripOwner(tripId, userId)

    const { data: existingDays, error: existingDaysError } = await this.supabaseService.adminClient
      .from('itinerary_days')
      .select('day_number')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: false })

    if (existingDaysError) {
      throw new Error(existingDaysError.message)
    }

    const nextDayNumber = (existingDays?.[0]?.day_number || 0) + 1
    const title = dto.title || `Day ${nextDayNumber}`

    const { data, error } = await this.supabaseService.adminClient
      .from('itinerary_days')
      .insert({
        trip_id: tripId,
        day_number: nextDayNumber,
        title,
      })
      .select('*')
      .single()

    if (error) throw new Error(error.message)
    return { ...data, items: [] }
  }

  async createItem(dayId: string, dto: CreateItineraryItemDto, userId: string) {
    await this.ensureDayOwner(dayId, userId)

    const payload = { ...dto, day_id: dayId } as any
    const { data, error } = await this.supabaseService.adminClient
      .from('itinerary_items')
      .insert(payload)
      .select(this.itemSelect)
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async updateItem(itemId: string, dto: UpdateItineraryItemDto, userId: string) {
    await this.ensureItemOwner(itemId, userId)

    const { data, error } = await this.supabaseService.adminClient
      .from('itinerary_items')
      .update(dto)
      .eq('id', itemId)
      .select(this.itemSelect)
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async deleteItem(itemId: string, userId: string) {
    await this.ensureItemOwner(itemId, userId)

    const { error } = await this.supabaseService.adminClient
      .from('itinerary_items')
      .delete()
      .eq('id', itemId)

    if (error) throw new Error(error.message)
    return { success: true }
  }
}