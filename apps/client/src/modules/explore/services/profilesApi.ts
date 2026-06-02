/**
 * Profiles API Service
 * Communicates with the NestJS backend at /profiles
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export interface ProfileSearchResult {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  avatar_url: string | null
}

export async function searchProfiles(query: string): Promise<ProfileSearchResult[]> {
  if (!query.trim()) return []

  const response = await fetch(
    `${API_BASE_URL}/profiles?q=${encodeURIComponent(query.trim())}`,
  )

  if (!response.ok) {
    throw new Error(`Failed to search profiles: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<ProfileSearchResult[]>
}
