import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { SupabaseService } from '../../supabase/supabase.service';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { data, error } = await this.supabaseService.anonClient
      .from('reviews')
      .insert(createReviewDto)
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService.anonClient
      .from('reviews')
      .select('*');

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.anonClient
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const { data, error } = await this.supabaseService.anonClient
      .from('reviews')
      .update(updateReviewDto)
      .eq('id', id)
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data || data.length === 0) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService.anonClient
      .from('reviews')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data || data.length === 0) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return {
      message: 'Review deleted successfully',
    };
  }
}
