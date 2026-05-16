export interface ItineraryItem {
  id: string
  title?: string
  time?: string
  category?: string
  duration?: string
  cost?: string
  notes?: string

  destination_id?: string | null

  destination?: {
    id: string
    name: string
    cover_image_url?: string
    province?: string
    category?: string
  } | null
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
