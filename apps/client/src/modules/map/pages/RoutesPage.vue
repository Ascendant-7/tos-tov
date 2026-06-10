<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import maplibregl, { type GeoJSONSource, type LngLatBoundsLike, type Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

type TravelMode = 'driving-car' | 'foot-walking' | 'cycling-regular'

interface TestStop {
  name: string
  description: string
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

const mapElement = ref<HTMLElement | null>(null)
const selectedMode = ref<TravelMode>('driving-car')
const isLoadingRoute = ref(false)
const errorMessage = ref('')
const routeGeometry = ref<GeoJSON.LineString | null>(null)
const routeDistance = ref(0)
const routeDuration = ref(0)
const routeLegs = ref<RouteLeg[]>([])

let map: Map | null = null
let markers: maplibregl.Marker[] = []

const orsApiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY

const testStops: TestStop[] = [
  {
    name: 'Royal Palace',
    description: 'Start in central Phnom Penh.',
    coordinates: [104.9336, 11.5633],
  },
  {
    name: 'Wat Phnom',
    description: 'Short city stop for route testing.',
    coordinates: [104.923, 11.5766],
  },
  {
    name: 'Tuol Sleng Museum',
    description: 'Final sample stop across town.',
    coordinates: [104.917, 11.5494],
  },
]

const modeOptions: Array<{ value: TravelMode; label: string }> = [
  { value: 'driving-car', label: 'Car' },
  { value: 'foot-walking', label: 'Walk' },
  { value: 'cycling-regular', label: 'Cycle' },
]

const formattedDistance = computed(() => {
  if (!routeDistance.value) return 'No route yet'
  return `${(routeDistance.value / 1000).toFixed(1)} km`
})

const formattedDuration = computed(() => {
  if (!routeDuration.value) return 'No route yet'

  const minutes = Math.round(routeDuration.value / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (!hours) return `${minutes} min`
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`
})

const formatLeg = (leg: RouteLeg) =>
  `${(leg.distance / 1000).toFixed(1)} km - ${Math.round(leg.duration / 60)} min`

const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'map-background',
      type: 'background',
      paint: {
        'background-color': '#dbeafe',
      },
    },
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
}

const logMapDiagnostics = (eventName: string, event?: Record<string, unknown>) => {
  if (!map) return

  const style = map.getStyle()
  const layers = (style.layers ?? []).map((layer) => ({
    id: layer.id,
    type: layer.type,
    source: 'source' in layer ? layer.source : undefined,
  }))

  console.log(`[RoutesPage] ${eventName}`, {
    event,
    isStyleLoaded: map.isStyleLoaded(),
    hasOsmSource: Boolean(map.getSource('osm')),
    style,
    layers,
    backgroundLayers: layers.filter((layer) => layer.type === 'background'),
  })
}

const initializeMap = async () => {
  await nextTick()
  if (!mapElement.value || map) return

  map = new maplibregl.Map({
    container: mapElement.value,
    style: mapStyle,
    center: [104.923, 11.563],
    zoom: 12,
  })

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')

  map.on('load', () => logMapDiagnostics('load'))
  map.on('error', (event) => {
    console.error('[RoutesPage] error', event)
    logMapDiagnostics('error', { message: 'map error event fired' })
  })
  map.on('styledata', (event) => {
    logMapDiagnostics('styledata', {
      styleType: event.dataType,
    })
  })
  map.on('sourcedata', (event) => {
    console.log('[RoutesPage] sourcedata', {
      sourceId: event.sourceId,
      sourceDataType: event.sourceDataType,
      isSourceLoaded: event.isSourceLoaded,
      sourceExists: event.sourceId ? Boolean(map?.getSource(event.sourceId)) : false,
    })
  })

  map.on('load', () => {
    addStopMarkers()
    ensureRouteLayers()
    fitToStops()
    void fetchRoute()
  })
}

const addStopMarkers = () => {
  markers.forEach((marker) => marker.remove())
  markers = testStops.map((stop, index) => {
    const markerElement = document.createElement('div')
    markerElement.className =
      'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-sm font-bold text-white shadow-lg'
    markerElement.textContent = String(index + 1)

    const popup = new maplibregl.Popup({ offset: 16 }).setHTML(
      `<strong>${stop.name}</strong><br/><span>${stop.description}</span>`,
    )

    return new maplibregl.Marker({ element: markerElement })
      .setLngLat(stop.coordinates)
      .setPopup(popup)
      .addTo(map!)
  })
}

const ensureRouteLayers = () => {
  if (!map || map.getSource('test-route')) return

  map.addSource('test-route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
    },
  })

  map.addLayer({
    id: 'test-route-line',
    type: 'line',
    source: 'test-route',
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

const fitToStops = () => {
  if (!map) return

  const firstStop = testStops[0]
  if (!firstStop) return

  const bounds = testStops.reduce(
    (currentBounds, stop) => currentBounds.extend(stop.coordinates),
    new maplibregl.LngLatBounds(firstStop.coordinates, firstStop.coordinates),
  )

  map.fitBounds(bounds as LngLatBoundsLike, { padding: 80, maxZoom: 13 })
}

const updateRouteLayer = () => {
  if (!map || !routeGeometry.value) return

  const source = map.getSource('test-route') as GeoJSONSource | undefined
  source?.setData({
    type: 'Feature',
    properties: {},
    geometry: routeGeometry.value,
  })
}

const fetchRoute = async () => {
  if (!orsApiKey) {
    errorMessage.value = 'Add VITE_OPENROUTESERVICE_API_KEY to apps/client/.env to request routes.'
    return
  }

  isLoadingRoute.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/${selectedMode.value}/geojson`,
      {
        method: 'POST',
        headers: {
          Authorization: orsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: testStops.map((stop) => stop.coordinates),
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`OpenRouteService request failed (${response.status})`)
    }

    const data = (await response.json()) as OrsRouteResponse
    const route = data.features?.[0]

    if (!route?.geometry) {
      throw new Error('OpenRouteService did not return a route geometry.')
    }

    routeGeometry.value = route.geometry
    routeDistance.value = route.properties?.summary?.distance || 0
    routeDuration.value = route.properties?.summary?.duration || 0
    routeLegs.value = route.properties?.segments || []

    updateRouteLayer()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load route.'
  } finally {
    isLoadingRoute.value = false
  }
}

watch(selectedMode, () => {
  void fetchRoute()
})

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
  <main class="min-h-screen bg-slate-50 p-6">
    <div class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-sky-700">Route Intel Test</p>
        <h1 class="mt-1 text-2xl font-bold text-slate-900">MapLibre + OpenRouteService</h1>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Test route rendering with sample Phnom Penh stops before connecting it to itinerary days.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="mode in modeOptions"
          :key="mode.value"
          type="button"
          class="rounded-lg border px-4 py-2 text-sm font-bold transition"
          :class="
            selectedMode === mode.value
              ? 'border-sky-600 bg-sky-600 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
          "
          @click="selectedMode = mode.value"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>

    <p
      v-if="errorMessage"
      class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
    >
      {{ errorMessage }}
    </p>

    <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div ref="mapElement" class="h-[540px] w-full"></div>
      </div>

      <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-4 grid grid-cols-2 gap-3">
          <div class="rounded-lg bg-slate-50 px-4 py-3">
            <p class="text-xs font-bold text-slate-500">Distance</p>
            <p class="mt-1 text-lg font-bold text-slate-900">{{ formattedDistance }}</p>
          </div>
          <div class="rounded-lg bg-slate-50 px-4 py-3">
            <p class="text-xs font-bold text-slate-500">Duration</p>
            <p class="mt-1 text-lg font-bold text-slate-900">{{ formattedDuration }}</p>
          </div>
        </div>

        <button
          type="button"
          class="mb-5 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isLoadingRoute"
          @click="fetchRoute"
        >
          {{ isLoadingRoute ? 'Loading Route...' : 'Refresh Route' }}
        </button>

        <div class="mb-5">
          <p class="mb-3 text-sm font-bold text-slate-900">Stops</p>
          <div class="space-y-3">
            <div
              v-for="(stop, index) in testStops"
              :key="stop.name"
              class="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <p class="text-sm font-bold text-slate-900">{{ index + 1 }}. {{ stop.name }}</p>
              <p class="mt-1 text-xs leading-5 text-slate-500">{{ stop.description }}</p>
            </div>
          </div>
        </div>

        <div>
          <p class="mb-3 text-sm font-bold text-slate-900">Route Legs</p>
          <div v-if="routeLegs.length" class="space-y-2">
            <div
              v-for="(leg, index) in routeLegs"
              :key="`${leg.distance}-${index}`"
              class="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800"
            >
              {{ testStops[index]?.name }} to {{ testStops[index + 1]?.name }}:
              {{ formatLeg(leg) }}
            </div>
          </div>
          <p v-else class="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Route legs will appear after OpenRouteService returns a route.
          </p>
        </div>
      </aside>
    </section>
  </main>
</template>
