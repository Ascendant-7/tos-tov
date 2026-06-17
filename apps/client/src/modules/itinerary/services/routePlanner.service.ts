import type { DayRouteStats, MapDestination, RouteSummary } from '@/modules/map/types/maps'
import { getDestinations } from './destination.service'

export interface RoutePlannerItemLike {
  id: string
  title?: string | null
  category?: string | null
  destination_id?: string | null
  destination?: {
    id?: string | null
    name?: string | null
    latitude?: number | null
    longitude?: number | null
    category?: string | null
  } | null
}

// Cache for destinations to avoid repeated API calls
let destinationsCache: Map<string, any> | null = null

const getDestinationCache = async () => {
  if (!destinationsCache) {
    const destinations = await getDestinations()
    destinationsCache = new Map(destinations.map((d: any) => [d.id, d]))
  }
  return destinationsCache
}

export const buildDayMapDestinations = async (items: RoutePlannerItemLike[]): Promise<MapDestination[]> => {
  const seenDestinationIds = new Set<string>()
  const destinationCache = await getDestinationCache()

  console.debug('[routePlanner] Items received:', items)
  console.debug('[routePlanner] Destinations cache size:', destinationCache.size)

  const destinations = items.flatMap((item) => {
    let destination = item.destination

    // If destination object is missing but we have destination_id, try to get it from cache
    if (!destination && item.destination_id) {
      destination = destinationCache.get(item.destination_id)
    }

    // Debug logging
    if (!destination) {
      console.warn('[routePlanner] Item missing destination data:', {
        itemId: item.id,
        itemTitle: item.title,
        destinationId: item.destination_id,
        hasDestinationObject: !!item.destination,
        itemKeys: Object.keys(item),
      })
    }

    if (
      !destination?.id ||
      seenDestinationIds.has(destination.id) ||
      destination.latitude == null ||
      destination.longitude == null ||
      !Number.isFinite(destination.latitude) ||
      !Number.isFinite(destination.longitude)
    ) {
      return []
    }

    seenDestinationIds.add(destination.id)

    return [
      {
        id: destination.id,
        name: destination.name || item.title || 'Stop',
        latitude: Number(destination.latitude),
        longitude: Number(destination.longitude),
        category: destination.category || item.category || null,
      },
    ]
  })

  console.debug('[routePlanner] Built destinations:', destinations.length, destinations)
  return destinations
}

export const calculateDayRouteStats = (
  route: RouteSummary | null,
  stopCount: number,
): DayRouteStats => ({
  totalDistanceKm: route ? route.distance / 1000 : 0,
  totalTravelMinutes: route ? Math.round(route.duration / 60) : 0,
  stopCount,
})

export const optimizeRouteOrder = (destinations: MapDestination[]): MapDestination[] =>
  destinations.slice()
