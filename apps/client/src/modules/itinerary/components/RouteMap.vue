<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import maplibregl, { type GeoJSONSource, type LngLatBoundsLike, type Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export interface RouteMapStop {
  id: string
  title: string
  coordinates: [number, number]
}

interface RouteLeg {
  distance: number
  duration: number
}

interface OrsRouteResponse {
  features?: Array<{
    geometry: GeoJSON.LineString
    properties?: {
      summary?: {
        distance?: number
        duration?: number
      }
      segments?: RouteLeg[]
    }
  }>
}

const props = withDefaults(
  defineProps<{
    stops: RouteMapStop[]
    profile?: 'driving-car' | 'foot-walking' | 'cycling-regular'
  }>(),
  {
    profile: 'driving-car',
  },
)

const mapElement = ref<HTMLElement | null>(null)
const isLoadingRoute = ref(false)
const errorMessage = ref('')
const routeDistance = ref(0)
const routeDuration = ref(0)

let map: Map | null = null
let markers: maplibregl.Marker[] = []

const orsApiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY

const canRoute = computed(() => props.stops.length >= 2)

const routeSummary = computed(() => {
  if (!routeDistance.value || !routeDuration.value) return 'Route not loaded yet'

  const distance = `${(routeDistance.value / 1000).toFixed(1)} km`
  const minutes = Math.round(routeDuration.value / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const duration = hours
    ? remainingMinutes
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`
    : `${minutes} min`

  return `${distance} - ${duration}`
})

const initializeMap = async () => {
  await nextTick()
  if (!mapElement.value || map) return

  const firstStop = props.stops[0]

  map = new maplibregl.Map({
    container: mapElement.value,
    style: 'https://demotiles.maplibre.org/style.json',
    center: firstStop?.coordinates || [104.923, 11.563],
    zoom: firstStop ? 12 : 6,
  })

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
  map.on('load', () => {
    ensureRouteLayer()
    refreshMap()
  })
}

const ensureRouteLayer = () => {
  if (!map || map.getSource('day-route')) return

  map.addSource('day-route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: [] },
    },
  })

  map.addLayer({
    id: 'day-route-line',
    type: 'line',
    source: 'day-route',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#0284c7',
      'line-width': 5,
      'line-opacity': 0.9,
    },
  })
}

const drawStops = () => {
  if (!map) return

  markers.forEach((marker) => marker.remove())
  markers = props.stops.map((stop, index) => {
    const markerElement = document.createElement('div')
    markerElement.className =
      'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-sm font-bold text-white shadow-lg'
    markerElement.textContent = String(index + 1)

    return new maplibregl.Marker({ element: markerElement })
      .setLngLat(stop.coordinates)
      .setPopup(new maplibregl.Popup({ offset: 16 }).setText(stop.title))
      .addTo(map!)
  })
}

const fitToStops = () => {
  if (!map || !props.stops.length) return

  const firstStop = props.stops[0]
  if (!firstStop) return

  const bounds = props.stops.reduce(
    (currentBounds, stop) => currentBounds.extend(stop.coordinates),
    new maplibregl.LngLatBounds(firstStop.coordinates, firstStop.coordinates),
  )

  map.fitBounds(bounds as LngLatBoundsLike, { padding: 70, maxZoom: 13 })
}

const setRouteGeometry = (geometry: GeoJSON.LineString | null) => {
  if (!map) return

  const source = map.getSource('day-route') as GeoJSONSource | undefined
  source?.setData({
    type: 'Feature',
    properties: {},
    geometry: geometry || { type: 'LineString', coordinates: [] },
  })
}

const fetchRoute = async () => {
  if (!canRoute.value) {
    setRouteGeometry(null)
    errorMessage.value = 'Add at least two destinations with coordinates to show a route.'
    return
  }

  if (!orsApiKey) {
    setRouteGeometry(null)
    errorMessage.value = 'Add VITE_OPENROUTESERVICE_API_KEY to apps/client/.env.'
    return
  }

  isLoadingRoute.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/${props.profile}/geojson`,
      {
        method: 'POST',
        headers: {
          Authorization: orsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: props.stops.map((stop) => stop.coordinates),
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`OpenRouteService request failed (${response.status})`)
    }

    const data = (await response.json()) as OrsRouteResponse
    const route = data.features?.[0]

    if (!route?.geometry) {
      throw new Error('OpenRouteService did not return route geometry.')
    }

    routeDistance.value = route.properties?.summary?.distance || 0
    routeDuration.value = route.properties?.summary?.duration || 0
    setRouteGeometry(route.geometry)
  } catch (error) {
    setRouteGeometry(null)
    routeDistance.value = 0
    routeDuration.value = 0
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load route.'
  } finally {
    isLoadingRoute.value = false
  }
}

const refreshMap = () => {
  if (!map?.loaded()) return

  drawStops()
  fitToStops()
  void fetchRoute()
}

watch(
  () => [props.profile, props.stops.map((stop) => `${stop.id}:${stop.coordinates.join(',')}`).join('|')],
  () => refreshMap(),
)

onMounted(() => {
  void initializeMap()
})

onBeforeUnmount(() => {
  markers.forEach((marker) => marker.remove())
  map?.remove()
  map = null
})
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-sky-100 bg-white">
    <div class="flex flex-col gap-2 border-b border-sky-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-bold text-gray-900">Map route</p>
        <p class="mt-0.5 text-xs font-medium text-gray-500">{{ routeSummary }}</p>
      </div>

      <button
        type="button"
        class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isLoadingRoute"
        @click="fetchRoute"
      >
        {{ isLoadingRoute ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <p
      v-if="errorMessage"
      class="border-b border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
    >
      {{ errorMessage }}
    </p>

    <div ref="mapElement" class="h-[360px] w-full"></div>
  </div>
</template>
