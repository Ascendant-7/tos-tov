import type { RouteSummary, TripStats } from '@/types/maps'

export function calculateTripStats(route: Pick<RouteSummary, 'distance' | 'duration'>): TripStats {
  return {
    totalDistanceKm: Number((route.distance / 1000).toFixed(1)),
    totalDurationMinutes: Math.round(route.duration / 60),
  }
}
