import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateItineraryItemDto } from './dto/create-itinerary-item.dto';
import { UpdateItineraryItemDto } from './dto/update-itinerary-item.dto';

@Injectable()
export class ItineraryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getItinerary(tripId: string) {
    const { data: days, error: daysError } = await this.supabaseService.client
      .from('itinerary_days')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true });

    if (daysError) {
      throw new Error(daysError.message);
    }

    const result: Array<{ items: any[] }> = [];

    for (const day of days || []) {
      const { data: items, error: itemsError } = await this.supabaseService.client
        .from('itinerary_items')
        .select('*')
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

  async createItem(dayId: string, dto: CreateItineraryItemDto) {
    const payload = { ...dto, day_id: dayId } as any;
    const { data, error } = await this.supabaseService.client
      .from('itinerary_items')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateItem(itemId: string, dto: UpdateItineraryItemDto) {
    const { data, error } = await this.supabaseService.client
      .from('itinerary_items')
      .update(dto)
      .eq('id', itemId)
      .select()
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
