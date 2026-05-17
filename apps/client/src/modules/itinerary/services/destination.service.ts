import { API_BASE_URL } from './api'

export const getDestinations = async () => {
  const response = await fetch(
    `${API_BASE_URL}/destinations`,
  )

  if (!response.ok) {
    throw new Error(
      `Failed to load destinations (${response.status})`,
    )
  }

  return await response.json()
}