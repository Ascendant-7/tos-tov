export type TravelProfile = 'driving-car' | 'foot-walking' | 'cycling-regular'

export interface MapDestination {
  id: string
  name: string
  latitude: number
  longitude: number
  category?: string | null
}

export interface RouteLeg {
  distance: number
  duration: number
}

export interface RouteSummary {
  geometry: GeoJSON.LineString
  distance: number
  duration: number
  legs: RouteLeg[]
}

export interface TripStats {
  totalDistanceKm: number
  totalDurationMinutes: number
}

export interface DayRouteStats {
  totalDistanceKm: number
  totalTravelMinutes: number
  stopCount: number
}
