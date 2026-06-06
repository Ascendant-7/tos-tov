const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export interface WeatherResponse {
  city: string
  temperature: number
  weatherCode: number
}

export async function fetchWeather(): Promise<WeatherResponse[]> {
  const response = await fetch(`${API_BASE_URL}/weather`)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch weather: ${response.status} ${response.statusText}`,
    )
  }

  return response.json() as Promise<WeatherResponse[]>
}
