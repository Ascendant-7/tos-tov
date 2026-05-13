export interface ItineraryItem {
  id: string
  title: string
  time: string
  category: string
  duration?: string
  cost?: string
  notes?: string
}

export interface ItineraryDay {
  id: string
  day_number: number
  title: string
  items: ItineraryItem[]
}

export interface ItineraryResponse {
  days: ItineraryDay[]
}