import type { RouteLeg, RouteSummary, TravelProfile } from '@/modules/map/types/maps'

interface OpenRouteServiceFeature {
  geometry?: GeoJSON.LineString
  properties?: {
    summary?: {
      distance?: number
      duration?: number
    }
    segments?: RouteLeg[]
  }
}

interface OpenRouteServiceResponse {
  features?: OpenRouteServiceFeature[]
}

const ORS_DIRECTIONS_URL = 'https://api.openrouteservice.org/v2/directions'

const getApiKey = () =>
  import.meta.env.VITE_ORS_API_KEY || import.meta.env.VITE_OPENROUTESERVICE_API_KEY

export async function getRoute(
  start: [number, number],
  end: [number, number],
  profile: TravelProfile = 'driving-car',
): Promise<RouteSummary> {
  return getMultiStopRoute([start, end], profile)
}

export async function getMultiStopRoute(
  coordinates: [number, number][],
  profile: TravelProfile = 'driving-car',
): Promise<RouteSummary> {
  const apiKey = getApiKey()

  if (!apiKey) {
    throw new Error('Add VITE_ORS_API_KEY to apps/client/.env to request routes.')
  }

  if (coordinates.length < 2) {
    throw new Error('At least two coordinates are required to request a route.')
  }

  const response = await fetch(`${ORS_DIRECTIONS_URL}/${profile}/geojson`, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ coordinates }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouteService request failed (${response.status})`)
  }

  const data = (await response.json()) as OpenRouteServiceResponse
  const route = data.features?.[0]

  if (!route?.geometry) {
    throw new Error('OpenRouteService did not return route geometry.')
  }

  return {
    geometry: route.geometry,
    distance: route.properties?.summary?.distance || 0,
    duration: route.properties?.summary?.duration || 0,
    legs: route.properties?.segments || [],
  }
}
