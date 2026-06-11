<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import maplibregl, { type GeoJSONSource, type LngLatBoundsLike, type Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { getMultiStopRoute } from '@/modules/map/services/openRouteService'
import type { DayRouteStats, MapDestination, RouteSummary, TravelProfile } from '@/modules/map/types/maps'
import {
  calculateDayRouteStats,
  optimizeRouteOrder,
} from '@/modules/itinerary/services/routePlanner.service'
import type { LineString } from 'geojson'

const props = withDefaults(
  defineProps<{
    destinations: MapDestination[]
    travelMode: TravelProfile
  }>(),
  {
    travelMode: 'driving-car',
  },
)

const mapContainer = ref<HTMLElement | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const isExpanded = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')
const isVisible = ref(false)
const selectedTravelMode = ref<TravelProfile>(props.travelMode)
const route = ref<RouteSummary | null>(null)

let map: Map | null = null
let markers: maplibregl.Marker[] = []
let visibilityObserver: IntersectionObserver | null = null

const modeLabels: Record<TravelProfile, string> = {
  'driving-car': 'Car',
  'foot-walking': 'Walk',
  'cycling-regular': 'Cycle',
}

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

const routeDestinations = computed(() => optimizeRouteOrder(props.destinations))

const routeStats = computed<DayRouteStats>(() =>
  calculateDayRouteStats(route.value, routeDestinations.value.length),
)

const canRoute = computed(() => routeDestinations.value.length >= 2)

const stopCards = computed(() =>
  routeDestinations.value.map((destination, index) => ({
    id: destination.id,
    number: index + 1,
    name: destination.name,
    category: destination.category || 'activity',
  })),
)

const selectedModeLabel = computed(() => modeLabels[selectedTravelMode.value])

const ensureMap = async () => {
  await nextTick()
  if (!mapContainer.value || map) return

  const firstDestination = routeDestinations.value[0]

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: mapStyle,
    center: firstDestination ? [firstDestination.longitude, firstDestination.latitude] : [104.923, 11.563],
    zoom: firstDestination ? 12 : 8,
  })

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')

  await new Promise<void>((resolve) => {
    map?.once('load', () => {
      ensureRouteLayer()
      syncMarkers()
      resolve()
    })
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

const syncMarkers = () => {
  if (!map) return

  markers.forEach((marker) => marker.remove())
  markers = routeDestinations.value.map((destination, index) => {
    const markerElement = document.createElement('div')
    markerElement.className =
      'flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-sm font-bold text-white shadow-lg'
    markerElement.textContent = String(index + 1)

    return new maplibregl.Marker({ element: markerElement })
      .setLngLat([destination.longitude, destination.latitude])
      .setPopup(new maplibregl.Popup({ offset: 16 }).setText(destination.name))
      .addTo(map!)
  })
}

const fitToRoute = () => {
  if (!map || routeDestinations.value.length === 0) return

  const first = routeDestinations.value[0]
  if (!first) return

  const bounds = routeDestinations.value.reduce(
    (currentBounds, destination) => currentBounds.extend([destination.longitude, destination.latitude]),
    new maplibregl.LngLatBounds([first.longitude, first.latitude], [first.longitude, first.latitude]),
  )

  map.fitBounds(bounds as LngLatBoundsLike, { padding: 64, maxZoom: 14 })
}

const setRouteGeometry = (geometry: LineString | null) => {
  const source = map?.getSource('day-route') as GeoJSONSource | undefined
  source?.setData({
    type: 'Feature',
    properties: {},
    geometry: geometry || { type: 'LineString', coordinates: [] },
  })
}

const loadRoute = async () => {
  if (!map || !canRoute.value || !isExpanded.value || !isVisible.value) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const fetchedRoute = await getMultiStopRoute(
      routeDestinations.value.map((destination) => [destination.longitude, destination.latitude]),
      selectedTravelMode.value,
    )

    route.value = fetchedRoute
    setRouteGeometry(fetchedRoute.geometry)
    syncMarkers()
    fitToRoute()
  } catch (error) {
    route.value = null
    setRouteGeometry(null)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load route.'
  } finally {
    isLoading.value = false
  }
}

const refreshRoute = async () => {
  if (!isVisible.value || !isExpanded.value || routeDestinations.value.length === 0) return

  await ensureMap()
  await loadRoute()
}

watch(
  () => props.travelMode,
  (travelMode) => {
    selectedTravelMode.value = travelMode
  },
)

watch([selectedTravelMode, routeDestinations, isExpanded, isVisible], () => {
  void refreshRoute()
})

onMounted(() => {
  if (!sectionRef.value) return

  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = Boolean(entry?.isIntersecting)
    },
    { threshold: 0.15 },
  )

  visibilityObserver.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  visibilityObserver?.disconnect()
  visibilityObserver = null
  markers.forEach((marker) => marker.remove())
  map?.remove()
  map = null
})
</script>

<template>
  <section ref="sectionRef" class="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p class="text-[11px] font-bold uppercase tracking-wide text-sky-700">Day Route</p>
        <h3 class="mt-1 text-base font-bold text-slate-900">
          {{ routeStats.stopCount }} stops in planned order
        </h3>
        <p class="mt-1 text-sm text-slate-500">Routes load when the day card comes into view.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="mode in ['driving-car', 'foot-walking', 'cycling-regular']"
          :key="mode"
          type="button"
          class="rounded-full px-3 py-2 text-xs font-bold transition"
          :class="selectedTravelMode === mode ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-slate-50'"
          @click="selectedTravelMode = mode as TravelProfile"
        >
          {{ modeLabels[mode as TravelProfile] }}
        </button>

        <button
          type="button"
          class="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? 'Collapse map' : 'Expand map' }}
        </button>
      </div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <div class="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">
        <p class="text-[11px] font-bold uppercase tracking-wide text-slate-400">Distance</p>
        <p class="mt-1 text-lg font-bold text-slate-900">
          {{ routeStats.totalDistanceKm ? routeStats.totalDistanceKm.toFixed(1) + ' km' : 'Loading...' }}
        </p>
      </div>
      <div class="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">
        <p class="text-[11px] font-bold uppercase tracking-wide text-slate-400">Travel Time</p>
        <p class="mt-1 text-lg font-bold text-slate-900">
          {{ routeStats.totalTravelMinutes ? `${routeStats.totalTravelMinutes} min` : 'Loading...' }}
        </p>
      </div>
      <div class="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">
        <p class="text-[11px] font-bold uppercase tracking-wide text-slate-400">Stops</p>
        <p class="mt-1 text-lg font-bold text-slate-900">{{ routeStats.stopCount }}</p>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isExpanded" class="mt-4 space-y-4">
        <div class="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
          <div ref="mapContainer" class="h-[420px] w-full"></div>
        </div>

        <div class="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-bold text-slate-900">Stops</p>
              <p class="mt-0.5 text-xs font-medium text-slate-500">
                {{ selectedModeLabel }} route preview
              </p>
            </div>

            <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
              {{ routeStats.stopCount }} stops
            </span>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="stop in stopCards"
              :key="stop.id"
              class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
            >
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                {{ stop.number }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-slate-900">{{ stop.name }}</p>
                <p class="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {{ stop.category }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <p
      v-if="errorMessage"
      class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>
