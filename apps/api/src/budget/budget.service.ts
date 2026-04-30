import { Injectable } from '@nestjs/common';

type ItineraryData = {
  hotel?: number;
  transport?: number;
  food?: number;
};

@Injectable()
export class BudgetService {
  receiveBudget(itineraryData: ItineraryData) {
    const total =
      (itineraryData.hotel || 0) +
      (itineraryData.transport || 0) +
      (itineraryData.food || 0);

    return {
      message: 'Budget received successfully',
      totalBudget: total,
      itinerary: itineraryData,
    };
  }
}