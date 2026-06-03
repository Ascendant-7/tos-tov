/**
 * Favorites API Service
 * Communicates with the NestJS backend at /favorites
 */

import { supabase } from '../../../services/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  }
}

export interface FavoriteItem {
  id: string
  created_at: string
  destination_id: string
  destinations: {
    id: string
    name: string
    description?: string
    province: string
    location_name?: string
    category: string
    cover_image_url?: string
    rating?: number | string
    badge?: string
    tags?: string[]
  }
}

/**
 * Get all favorites for the authenticated user
 */
export async function getFavorites(): Promise<FavoriteItem[]> {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch favorites: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<FavoriteItem[]>
}

/**
 * Add a destination to favorites
 */
export async function addFavorite(destinationId: string): Promise<FavoriteItem> {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ destination_id: destinationId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to add favorite: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<FavoriteItem>
}

/**
 * Remove a destination from favorites
 */
export async function removeFavorite(destinationId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/favorites/${destinationId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to remove favorite: ${response.status} ${response.statusText}`)
  }
}

/**
 * Check if a destination is favorited by the authenticated user
 */
export async function checkFavorite(
  destinationId: string,
): Promise<{ isFavorited: boolean }> {
  const response = await fetch(`${API_BASE_URL}/favorites/check/${destinationId}`, {
    headers: await getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to check favorite: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<{ isFavorited: boolean }>
}
