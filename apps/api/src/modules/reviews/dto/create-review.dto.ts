import { IsUUID, IsInt, Min, Max } from 'class-validator'

export class CreateReviewDto {
  @IsUUID()
  destination_id: string

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number
}
