import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@repo/supabase';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateItineraryDayDto } from './dto/create-itinerary-day.dto';
import { CreateItineraryItemDto } from './dto/create-itinerary-item.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { UpdateItineraryItemDto } from './dto/update-itinerary-item.dto';
import { ItineraryService } from './itinerary.service';
import { AuthGuard } from '../../common/guards/auth.guard';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('itinerary')
@UseGuards(AuthGuard)
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post('trips')
  createTrip(@Body() dto: CreateTripDto, @Req() request: AuthenticatedRequest) {
    return this.itineraryService.createTrip(dto, request.user.id);
  }

  @Get('trips')
  getTrips(@Req() request: AuthenticatedRequest) {
    return this.itineraryService.getTrips(request.user.id);
  }

  @Get('shared-trips')
  getSharedTrips() {
    return this.itineraryService.getSharedTrips();
  }

  @Patch('trips/:tripId')
  updateTrip(
    @Param('tripId') tripId: string,
    @Body() dto: UpdateTripDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.itineraryService.updateTrip(tripId, dto, request.user.id);
  }

  @Get(':tripId')
  getItinerary(
    @Param('tripId') tripId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.itineraryService.getItinerary(tripId, request.user.id);
  }

  @Post(':tripId/days')
  createDay(
    @Param('tripId') tripId: string,
    @Body() dto: CreateItineraryDayDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.itineraryService.createDay(tripId, dto, request.user.id);
  }

  @Post('days/:dayId/items')
  createItem(
    @Param('dayId') dayId: string,
    @Body() dto: CreateItineraryItemDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.itineraryService.createItem(dayId, dto, request.user.id);
  }

  @Patch('items/:itemId')
  updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateItineraryItemDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.itineraryService.updateItem(itemId, dto, request.user.id);
  }

  @Delete('items/:itemId')
  deleteItem(
    @Param('itemId') itemId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.itineraryService.deleteItem(itemId, request.user.id);
  }
}
