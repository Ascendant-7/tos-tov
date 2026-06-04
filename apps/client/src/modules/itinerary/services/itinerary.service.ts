import type { ItineraryResponse } from '../types/itineraryItem.types'
import { API_BASE_URL } from './api'

interface ItineraryApiItem {
  id: string
  title?: string
  time?: string
  category?: string | null
  duration?: string | null
  cost?: string | null
  notes?: string | null

  destination_id?: string | null

  destination?: {
    id: string
    name: string
    cover_image_url?: string | null
    province?: string | null
    location_name?: string | null
    category?: string | null
    latitude?: number | string | null
    longitude?: number | string | null
  } | null
}

interface ItineraryApiDay {
  id: string
  day_number: number
  title?: string | null
  items: ItineraryApiItem[]
}

interface ItineraryApiResponse {
  trip?: {
    id: string
    title?: string
    description?: string | null
    user_id?: string | null
    visibility?: string | null
    can_edit?: boolean
  }
  days: ItineraryApiDay[]
}

interface TripApiResponse {
  id: string
  title: string
  description?: string | null
  user_id?: string | null
  visibility?: 'private' | 'public' | string | null
  created_at?: string
}

export type Trip = TripApiResponse

import { supabase } from '../../../services/supabase'

const authHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const createTrip = async (trip: {
  title: string
  description?: string
}): Promise<TripApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/itinerary/trips`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({
      title: trip.title,
      description: trip.description || null,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create trip (${response.status})`)
  }

  return await response.json()
}

export const getTrips = async (): Promise<Trip[]> => {
  const response = await fetch(`${API_BASE_URL}/itinerary/trips`, {
    headers: await authHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to load trips (${response.status})`)
  }

  return await response.json()
}

export const getSharedTrips = async (): Promise<Trip[]> => {
  const response = await fetch(`${API_BASE_URL}/itinerary/shared-trips`, {
    headers: await authHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to load shared trips (${response.status})`)
  }

  return await response.json()
}

export const updateTrip = async (
  tripId: string,
  trip: Partial<Pick<Trip, 'title' | 'description' | 'visibility'>>,
): Promise<TripApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/itinerary/trips/${encodeURIComponent(tripId)}`, {
    method: 'PATCH',
    headers: await authHeaders(),
    body: JSON.stringify(trip),
  })

  if (!response.ok) {
    throw new Error(`Failed to update trip (${response.status})`)
  }

  return await response.json()
}

export const getItinerary = async (tripId: string): Promise<ItineraryResponse> => {
  const response = await fetch(`${API_BASE_URL}/itinerary/${encodeURIComponent(tripId)}`, {
    headers: await authHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to load itinerary (${response.status})`)
  }

  const data = (await response.json()) as ItineraryApiResponse

  return {
    trip: data.trip,
    days: (data.days || []).map((day) => ({
      id: day.id,
      day_number: day.day_number,
      title: day.title || `Day ${day.day_number}`,
      items: (day.items || []).map((item) => ({
        id: item.id,
        title: item.destination?.name || item.title || 'Untitled',
        time: item.time,
        category: item.destination?.category || item.category || 'activity',
        duration: item.duration || undefined,
        cost: item.cost || undefined,
        notes: item.notes || undefined,
        destination_id: item.destination_id || undefined,
        destination: item.destination
          ? {
              id: item.destination.id,
              name: item.destination.name,
              cover_image_url: item.destination.cover_image_url || undefined,
              province: item.destination.province || undefined,
              location_name: item.destination.location_name || undefined,
              category: item.destination.category || undefined,
              latitude:
                item.destination.latitude == null ? null : Number(item.destination.latitude),
              longitude:
                item.destination.longitude == null ? null : Number(item.destination.longitude),
            }
          : undefined,
      })),
    })),
  }
}

export const createDay = async (tripId: string, title?: string) => {
  const response = await fetch(`${API_BASE_URL}/itinerary/${encodeURIComponent(tripId)}/days`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create day (${response.status})`)
  }

  return await response.json()
}

export const createItem = async (dayId: string, item: any) => {
  const response = await fetch(
    `${API_BASE_URL}/itinerary/days/${encodeURIComponent(dayId)}/items`,
    {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({
        title: item.title,
        destination_id: item.destination_id || null,
        time: item.time,
        category: item.category,
        duration: item.duration || null,
        cost: item.cost || null,
        notes: item.notes || null,
        position: item.position || 0,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to create item (${response.status})`)
  }

  return await response.json()
}

export const updateItem = async (itemId: string, item: any) => {
  const response = await fetch(`${API_BASE_URL}/itinerary/items/${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    headers: await authHeaders(),
    body: JSON.stringify({
      title: item.title,
      destination_id: item.destination_id || null,
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
    headers: await authHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete item (${response.status})`)
  }

  return await response.json()
}
