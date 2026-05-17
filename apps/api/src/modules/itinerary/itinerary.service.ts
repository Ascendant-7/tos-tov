import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateItineraryDayDto } from './dto/create-itinerary-day.dto';
import { CreateItineraryItemDto } from './dto/create-itinerary-item.dto';
import { UpdateItineraryItemDto } from './dto/update-itinerary-item.dto';

@Injectable()
export class ItineraryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private readonly itemSelect = `
    *,
    destination:destinations (
      id,
      name,
      cover_image_url,
      province,
      category
    )
  `;

  async createTrip(dto: CreateTripDto) {
    const { data, error } = await this.supabaseService.client
      .from('trips')
      .insert({
        title: dto.title,
        description: dto.description || null,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getItinerary(tripId: string) {
    const { data: tripDays, error: daysError } = await this.supabaseService.client
      .from('itinerary_days')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true });

    if (daysError) {
      throw new Error(daysError.message);
    }

    const days = tripDays || [];

    const result: Array<{ items: any[] }> = [];

    for (const day of days) {
      const { data: items, error: itemsError } = await this.supabaseService.client
        .from('itinerary_items')
        .select(this.itemSelect)
        .eq('day_id', day.id)
        .order('position', { ascending: true });

      if (itemsError) {
        throw new Error(itemsError.message);
      }

      result.push({
        ...day,
        items,
      });
    }

    return { days: result };
  }

  async createDay(tripId: string, dto: CreateItineraryDayDto) {
    const { data: existingDays, error: existingDaysError } = await this.supabaseService.client
      .from('itinerary_days')
      .select('day_number')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: false });

    if (existingDaysError) {
      throw new Error(existingDaysError.message);
    }

    const nextDayNumber = (existingDays?.[0]?.day_number || 0) + 1;
    const title = dto.title || `Day ${nextDayNumber}`;

    const { data, error } = await this.supabaseService.client
      .from('itinerary_days')
      .insert({
        trip_id: tripId,
        day_number: nextDayNumber,
        title,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return { ...data, items: [] };
  }

  async createItem(dayId: string, dto: CreateItineraryItemDto) {
    const payload = { ...dto, day_id: dayId } as any;
    const { data, error } = await this.supabaseService.client
      .from('itinerary_items')
      .insert(payload)
      .select(this.itemSelect)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateItem(itemId: string, dto: UpdateItineraryItemDto) {
    const { data, error } = await this.supabaseService.client
      .from('itinerary_items')
      .update(dto)
      .eq('id', itemId)
      .select(this.itemSelect)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteItem(itemId: string) {
    const { error } = await this.supabaseService.client
      .from('itinerary_items')
      .delete()
      .eq('id', itemId);

    if (error) throw new Error(error.message);
    return { success: true };
  }
}
