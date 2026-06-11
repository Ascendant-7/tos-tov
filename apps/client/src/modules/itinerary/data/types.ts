export type CuratedTripItem = {
  time: string
  title: string
  category: 'activity' | 'attraction' | 'food' | 'hotel' | 'rest'
  duration: string
  cost: number
  notes: string
}

export type CuratedTripPlan = {
  id: string
  province: string
  title: string
  baseDays: number
  budget: number
  style: string
  description: string
  highlights: string[]
  itinerary: CuratedTripItem[][]
}
