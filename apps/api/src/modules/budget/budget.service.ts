import { Injectable } from '@nestjs/common'
import { CreateBudgetDto } from './dto/create-budget.dto'
import { UpdateBudgetDto } from './dto/update-budget.dto'
import { Budget } from './entities/budget.entity'

@Injectable()
export class BudgetService {
  private budgets: Budget[] = []

  receiveBudget(createBudgetDto: CreateBudgetDto) {
    const total =
      (createBudgetDto.hotel || 0) + (createBudgetDto.transport || 0) + (createBudgetDto.food || 0)

    const newBudget: Budget = {
      id: this.budgets.length + 1,
      ...createBudgetDto,
      totalBudget: total,
    }

    this.budgets.push(newBudget)

    return {
      message: 'Budget received successfully',
      budget: newBudget,
    }
  }

  findAll() {
    return this.budgets
  }

  findOne(id: number) {
    return this.budgets.find((budget) => budget.id === id)
  }

  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    const budget = this.findOne(id)

    if (!budget) {
      return { message: 'Budget not found' }
    }

    Object.assign(budget, updateBudgetDto)

    budget.totalBudget = (budget.hotel || 0) + (budget.transport || 0) + (budget.food || 0)

    return {
      message: 'Budget updated successfully',
      budget,
    }
  }

  remove(id: number) {
    const index = this.budgets.findIndex((budget) => budget.id === id)

    if (index === -1) {
      return { message: 'Budget not found' }
    }

    const deletedBudget = this.budgets[index]

    this.budgets.splice(index, 1)

    return {
      message: 'Budget deleted successfully',
      budget: deletedBudget,
    }
  }
}
