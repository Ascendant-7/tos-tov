import { API_BASE_URL } from './api'
import { supabase } from '../../../services/supabase'

export const getDestinations = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const response = await fetch(`${API_BASE_URL}/destinations`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load destinations (${response.status})`)
  }

  return await response.json()
}
