import { Body, Controller, Post } from '@nestjs/common';
import { BudgetService } from './budget.service';

type ItineraryData = {
  hotel?: number;
  transport?: number;
  food?: number;
};

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  receiveBudget(@Body() itineraryData: ItineraryData) {
    return this.budgetService.receiveBudget(itineraryData);
  }
}