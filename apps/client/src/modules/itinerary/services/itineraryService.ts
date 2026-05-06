import type { ItineraryResponse } from '../types/itineraryItem.types'

interface ItineraryApiItem {
  id: string
  title: string
  time: string
  category?: string | null
  duration?: string | null
  cost?: string | null
  notes?: string | null
}

interface ItineraryApiDay {
  id: string
  day_number: number
  title?: string | null
  items: ItineraryApiItem[]
}

interface ItineraryApiResponse {
  days: ItineraryApiDay[]
}

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:3000'

const DEFAULT_TRIP_ID = import.meta.env.VITE_ITINERARY_TRIP_ID as string | undefined

export const getItinerary = async (tripId = DEFAULT_TRIP_ID): Promise<ItineraryResponse> => {
  if (!tripId) {
    throw new Error('Missing trip id. Pass tripId or set VITE_ITINERARY_TRIP_ID.')
  }

  const response = await fetch(`${API_BASE_URL}/itinerary/${encodeURIComponent(tripId)}`)

  if (!response.ok) {
    throw new Error(`Failed to load itinerary (${response.status})`)
  }

  const data = (await response.json()) as ItineraryApiResponse

  return {
    days: (data.days || []).map((day) => ({
      id: day.id,
      day_number: day.day_number,
      title: day.title || `Day ${day.day_number}`,
      items: (day.items || []).map((item) => ({
        id: item.id,
        title: item.title,
        time: item.time,
        category: item.category || 'activity',
        duration: item.duration || undefined,
        cost: item.cost || undefined,
        notes: item.notes || undefined,
      })),
    })),
  }
}

export const createTrip = async (title: string, description?: string) => {
  const response = await fetch(`${API_BASE_URL}/itinerary/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description: description || null }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create trip (${response.status})`)
  }

  return await response.json()
}

export const createDay = async (tripId: string, title?: string) => {
  const response = await fetch(`${API_BASE_URL}/itinerary/${encodeURIComponent(tripId)}/days`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create day (${response.status})`)
  }

  return await response.json()
}

export const createItem = async (dayId: string, item: any) => {
  const response = await fetch(`${API_BASE_URL}/itinerary/days/${encodeURIComponent(dayId)}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: item.title,
      time: item.time,
      category: item.category,
      duration: item.duration || null,
      cost: item.cost || null,
      notes: item.notes || null,
      position: item.position || 0,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create item (${response.status})`)
  }

  return await response.json()
}

export const updateItem = async (itemId: string, item: any) => {
  const response = await fetch(`${API_BASE_URL}/itinerary/items/${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: item.title,
      time: item.time,
      category: item.category,
      duration: item.duration || null,
      cost: item.cost || null,
      notes: item.notes || null,
      position: item.position,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update item (${response.status})`)
  }

  return await response.json()
}

export const deleteItem = async (itemId: string) => {
  const response = await fetch(`${API_BASE_URL}/itinerary/items/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete item (${response.status})`)
  }

  return await response.json()
}
