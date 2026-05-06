import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateItineraryItemDto } from './dto/create-itinerary-item.dto';
import { UpdateItineraryItemDto } from './dto/update-itinerary-item.dto';
import { ItineraryService } from './itinerary.service';

@Controller('itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Get(':tripId')
  getItinerary(@Param('tripId') tripId: string) {
    return this.itineraryService.getItinerary(tripId);
  }

  @Post('days/:dayId/items')
  createItem(
    @Param('dayId') dayId: string,
    @Body() dto: CreateItineraryItemDto,
  ) {
    return this.itineraryService.createItem(dayId, dto);
  }

  @Patch('items/:itemId')
  updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateItineraryItemDto,
  ) {
    return this.itineraryService.updateItem(itemId, dto);
  }

  @Delete('items/:itemId')
  deleteItem(@Param('itemId') itemId: string) {
    return this.itineraryService.deleteItem(itemId);
  }
}
