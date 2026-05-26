import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { SupabaseService } from '../../supabase/supabase.service'
import { CreateDestinationDto } from './dto/create-destination.dto'
import { UpdateDestinationDto } from './dto/update-destination.dto'

@Injectable()
export class DestinationsService {
  constructor(private readonly supabaseService: SupabaseService) {}
  async create(createDestinationDto: CreateDestinationDto) {
    const { data, error } = await this.supabaseService.anonClient
      .from('destinations')
      .insert(createDestinationDto)
      .select()

    if (error) {
      throw new InternalServerErrorException(error.message)
    }

    return data
  }

  async findAll() {
    const { data, error } = await this.supabaseService.anonClient.from('destinations').select('*')

    if (error) {
      throw new InternalServerErrorException(error.message)
    }

    return data
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.anonClient
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new NotFoundException(`Destination with id ${id} not found`)
    }

    return data
  }

  async update(id: string, updateDestinationDto: UpdateDestinationDto) {
    const { data, error } = await this.supabaseService.anonClient
      .from('destinations')
      .update(updateDestinationDto)
      .eq('id', id)
      .select()

    if (error) {
      throw new InternalServerErrorException(error.message)
    }

    return data
  }

  async remove(id: string) {
    const { error } = await this.supabaseService.anonClient
      .from('destinations')
      .delete()
      .eq('id', id)

    if (error) {
      throw new InternalServerErrorException(error.message)
    }

    return {
      message: 'Destination deleted successfully',
    }
  }
}
