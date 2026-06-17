/**
 * Destinations API Service
 * Communicates with the NestJS backend at /destinations
 */

import { supabase } from '../../../services/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  }
}

/**
 * Raw shape returned by the backend (matches Supabase destinations table)
 */
export interface DestinationApiResponse {
  id: string
  created_at?: string
  name: string
  description?: string
  province: string
  location_name?: string
  latitude?: number | string | null
  longitude?: number | string | null
  category: string
  cover_image_url?: string
  duration_min?: number
  duration_max?: number
  budget_min?: number
  budget_max?: number
  rating?: number | string
  badge?: string
  tags?: string[]
  is_hidden_gem: boolean
}

/**
 * Payload for creating a new destination (POST /destinations)
 */
export interface CreateDestinationPayload {
  name: string
  description?: string
  province: string
  location_name?: string
  latitude?: number
  longitude?: number
  category: string
  cover_image_url?: string
  duration_min?: number
  duration_max?: number
  budget_min?: number
  budget_max?: number
}

export async function fetchDestinations(): Promise<DestinationApiResponse[]> {
  const response = await fetch(`${API_BASE_URL}/destinations`, {
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch destinations: ${response.status} ${response.statusText}`)
  }

  const data: DestinationApiResponse[] = await response.json()
  return data
}

export async function createDestination(
  payload: CreateDestinationPayload,
): Promise<DestinationApiResponse> {
  const response = await fetch(`${API_BASE_URL}/destinations`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message =
      (errorBody as { message?: string | string[] }).message ??
      `Failed to create destination: ${response.status} ${response.statusText}`
    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }

  return response.json() as Promise<DestinationApiResponse>
}
