<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import maplibregl, { type GeoJSONSource, type LngLatBoundsLike, type Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { getMultiStopRoute } from '@/modules/map/services/openRouteService'
import type { MapDestination, RouteSummary, TravelProfile } from '@/modules/map/types/maps'
import { useUserLocation } from '@/modules/map/composables/useUserLocation'

const props = withDefaults(
  defineProps<{
    destinations: MapDestination[]
    profile?: TravelProfile
    clusterMarkers?: boolean
    showUserLocation?: boolean
    animateRoute?: boolean
  }>(),
  {
    profile: 'driving-car',
    clusterMarkers: true,
    showUserLocation: true,
    animateRoute: true,
  },
)

const emit = defineEmits<{
  routeLoaded: [route: RouteSummary]
  routeError: [message: string]
}>()

const mapElement = ref<HTMLElement | null>(null)
const isLoadingRoute = ref(false)
const errorMessage = ref('')
const routeSummary = ref<RouteSummary | null>(null)
const {
  coordinates: userCoordinates,
  isLocating,
  locationError,
  requestLocation,
} = useUserLocation()

let map: Map | null = null
let userMarker: maplibregl.Marker | null = null
let animationFrameId = 0

const validDestinations = computed(() =>
  props.destinations.filter(
    (destination) =>
      Number.isFinite(destination.latitude) && Number.isFinite(destination.longitude),
  ),
)

const destinationCoordinates = computed<[number, number][]>(() =>
  validDestinations.value.map((destination) => [destination.longitude, destination.latitude]),
)

const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
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


// const logMapDiagnostics = (eventName: string, event?: Record<string, unknown>) => {
//   if (!map) return

//   const style = map.getStyle()
//   const layerSummary = (style.layers ?? []).map((layer) => ({
//     id: layer.id,
//     type: layer.type,
//     source: 'source' in layer ? layer.source : undefined,
//   }))

//   console.log(`[MapView] ${eventName}`, {
//     event,
//     isStyleLoaded: map.isStyleLoaded(),
//     hasOsmSource: Boolean(map.getSource('osm')),
//     style,
//     layerSummary,
//     backgroundLayers: layerSummary.filter((layer) => layer.type === 'background'),
//   })
// }


const categoryColors: Record<string, string> = {
  culture: '#7c3aed',
  dining: '#dc2626',
  nature: '#16a34a',
  shopping: '#ca8a04',
  activity: '#0284c7',
}

const categoryIcon = (category?: string | null) => {
  const normalizedCategory = category?.toLowerCase() || 'activity'
  if (normalizedCategory.includes('museum') || normalizedCategory.includes('culture')) return 'M'
  if (normalizedCategory.includes('food') || normalizedCategory.includes('dining')) return 'D'
  if (normalizedCategory.includes('nature') || normalizedCategory.includes('park')) return 'N'
  if (normalizedCategory.includes('shop') || normalizedCategory.includes('market')) return 'S'
  return 'P'
}

const categoryColor = (category?: string | null) => {
  const normalizedCategory = category?.toLowerCase() || 'activity'
  const key = Object.keys(categoryColors).find((item) => normalizedCategory.includes(item))
  return key ? categoryColors[key] : categoryColors.activity
}

const buildDestinationCollection = (): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
  type: 'FeatureCollection',
  features: validDestinations.value.map((destination, index) => ({
    type: 'Feature',
    id: destination.id,
    properties: {
      id: destination.id,
      name: destination.name,
      stopNumber: index + 1,
      categoryIcon: categoryIcon(destination.category),
      color: categoryColor(destination.category),
    },
    geometry: {
      type: 'Point',
      coordinates: [destination.longitude, destination.latitude],
    },
  })),
})

const initializeMap = async () => {
  await nextTick()
  if (!mapElement.value || map) return

  const firstCoordinate = destinationCoordinates.value[0] || [104.923, 11.563]

  map = new maplibregl.Map({
    container: mapElement.value,
    style: mapStyle,
    center: firstCoordinate,
    zoom: destinationCoordinates.value.length ? 12 : 6,
  })

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')

  map.on('load', () => {
    // logMapDiagnostics('load')
    ensureDestinationLayers()
    ensureRouteLayer()
    bindMapEvents()
    refreshMap()
  })

  // map.on('error', (event) => {
  //   console.error('[MapView] error', event)
  //   logMapDiagnostics('error', {
  //     message: 'map error event fired',
  //   })
  // })

  // map.on('styledata', (event) => {
  //   logMapDiagnostics('styledata', {
  //     styleType: event.dataType,
  //   })
  // })

//   map.on('sourcedata', (event) => {
//     console.log('[MapView] sourcedata', {
//       sourceId: event.sourceId,
//       sourceDataType: event.sourceDataType,
//       isSourceLoaded: event.isSourceLoaded,
//       sourceExists: event.sourceId ? Boolean(map?.getSource(event.sourceId)) : false,
//     })

//     if (event.sourceId === 'osm') {
//       logMapDiagnostics('osm sourcedata', {
//         sourceId: event.sourceId,
//         isSourceLoaded: event.isSourceLoaded,
//         sourceDataType: event.sourceDataType,
//       })
//     }
//   })
// }
}

const ensureDestinationLayers = () => {
  if (!map || map.getSource('destinations')) return

  map.addSource('destinations', {
    type: 'geojson',
    data: buildDestinationCollection(),
    cluster: props.clusterMarkers,
    clusterRadius: 44,
    clusterMaxZoom: 14,
  })

  map.addLayer({
    id: 'destination-clusters',
    type: 'circle',
    source: 'destinations',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#0f766e',
      'circle-radius': ['step', ['get', 'point_count'], 18, 10, 22, 25, 28],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    },
  })

  map.addLayer({
    id: 'destination-cluster-count',
    type: 'symbol',
    source: 'destinations',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-size': 12,
      'text-font': ['Open Sans Bold'],
    },
    paint: {
      'text-color': '#ffffff',
    },
  })

  map.addLayer({
    id: 'destination-markers',
    type: 'circle',
    source: 'destinations',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': ['get', 'color'],
      'circle-radius': 13,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    },
  })

  map.addLayer({
    id: 'destination-marker-icons',
    type: 'symbol',
    source: 'destinations',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': ['get', 'categoryIcon'],
      'text-size': 11,
      'text-font': ['Open Sans Bold'],
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#ffffff',
    },
  })
}

const ensureRouteLayer = () => {
  if (!map || map.getSource('trip-route')) return

  map.addSource('trip-route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: [] },
    },
  })

  map.addLayer(
    {
      id: 'trip-route-line',
      type: 'line',
      source: 'trip-route',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#0284c7',
        'line-width': 5,
        'line-opacity': 0.9,
      },
    },
    'destination-clusters',
  )
}

const bindMapEvents = () => {
  if (!map) return

  map.on('click', 'destination-markers', (event) => {
    const feature = event.features?.[0]
    const coordinates = feature?.geometry.type === 'Point' ? feature.geometry.coordinates : null
    const name = feature?.properties?.name
    if (!coordinates || !name) return

    new maplibregl.Popup({ offset: 18 })
      .setLngLat(coordinates as [number, number])
      .setText(name)
      .addTo(map!)
  })

  map.on('click', 'destination-clusters', (event) => {
    const feature = event.features?.[0]
    const clusterId = feature?.properties?.cluster_id
    const source = map?.getSource('destinations') as GeoJSONSource | undefined
    if (clusterId == null || !source || feature?.geometry.type !== 'Point') return

    void source.getClusterExpansionZoom(clusterId).then((zoom) => {
      if (feature.geometry.type !== 'Point') return
      map?.easeTo({ center: feature.geometry.coordinates as [number, number], zoom })
    })
  })

  map.on('mouseenter', 'destination-markers', () => {
    if (map) map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'destination-markers', () => {
    if (map) map.getCanvas().style.cursor = ''
  })
}

const updateDestinationSource = () => {
  const source = map?.getSource('destinations') as GeoJSONSource | undefined
  source?.setData(buildDestinationCollection())
}

const setRouteGeometry = (geometry: GeoJSON.LineString | null, animated = false) => {
  const source = map?.getSource('trip-route') as GeoJSONSource | undefined
  if (!source) return

  cancelAnimationFrame(animationFrameId)
  const emptyGeometry: GeoJSON.LineString = { type: 'LineString', coordinates: [] }

  if (!geometry || !animated) {
    source.setData({ type: 'Feature', properties: {}, geometry: geometry || emptyGeometry })
    return
  }

  const coordinates = geometry.coordinates
  let index = 1

  const drawFrame = () => {
    source.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates.slice(0, index),
      },
    })

    index += Math.max(1, Math.ceil(coordinates.length / 90))
    if (index <= coordinates.length) {
      animationFrameId = requestAnimationFrame(drawFrame)
      return
    }

    source.setData({ type: 'Feature', properties: {}, geometry })
  }

  drawFrame()
}

const fitToCoordinates = (coordinates: [number, number][], maxZoom = 13) => {
  if (!map || coordinates.length === 0) return

  const firstCoordinate = coordinates[0]
  if (!firstCoordinate) return

  const bounds = coordinates.reduce(
    (currentBounds, coordinate) => currentBounds.extend(coordinate),
    new maplibregl.LngLatBounds(firstCoordinate, firstCoordinate),
  )

  map.fitBounds(bounds as LngLatBoundsLike, { padding: 72, maxZoom })
}

const fitToRoute = (geometry: GeoJSON.LineString) => {
  fitToCoordinates(geometry.coordinates as [number, number][], 14)
}

const fetchRoute = async () => {
  if (destinationCoordinates.value.length < 2) {
    routeSummary.value = null
    errorMessage.value = ''
    setRouteGeometry(null)
    fitToCoordinates(destinationCoordinates.value)
    return
  }

  isLoadingRoute.value = true
  errorMessage.value = ''

  try {
    const route = await getMultiStopRoute(destinationCoordinates.value, props.profile)
    routeSummary.value = route
    setRouteGeometry(route.geometry, props.animateRoute)
    fitToRoute(route.geometry)
    emit('routeLoaded', route)
  } catch (error) {
    routeSummary.value = null
    setRouteGeometry(null)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load route.'
    emit('routeError', errorMessage.value)
    fitToCoordinates(destinationCoordinates.value)
  } finally {
    isLoadingRoute.value = false
  }
}

const refreshMap = () => {
  if (!map?.loaded()) return

  updateDestinationSource()
  void fetchRoute()
}

const centerOnUser = async () => {
  if (!props.showUserLocation || !map) return

  try {
    const coordinates = await requestLocation()
    if (!userMarker) {
      const markerElement = document.createElement('div')
      markerElement.className =
        'h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-[0_0_0_6px_rgba(37,99,235,0.18)]'
      userMarker = new maplibregl.Marker({ element: markerElement })
        .setLngLat(coordinates)
        .addTo(map)
    } else {
      userMarker.setLngLat(coordinates)
    }
    map.easeTo({ center: coordinates, zoom: Math.max(map.getZoom(), 14) })
  } catch {
    errorMessage.value = locationError.value || 'Unable to get your current location.'
  }
}

watch(
  () =>
    [
      props.profile,
      props.clusterMarkers,
      validDestinations.value
        .map((destination) =>
          [
            destination.id,
            destination.name,
            destination.latitude,
            destination.longitude,
            destination.category || '',
          ].join(':'),
        )
        .join('|'),
    ].join('|'),
  () => refreshMap(),
)

watch(userCoordinates, (coordinates) => {
  if (!coordinates || !userMarker || !map) return
  userMarker.setLngLat(coordinates)
})

onMounted(() => {
  void initializeMap()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  userMarker?.remove()
  map?.remove()
  map = null
})
</script>

<template>
  <div
    class="relative min-h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
  >
    <div ref="mapElement" class="h-[420px] w-full"></div>

    <div class="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
      <button
        v-if="showUserLocation"
        type="button"
        class="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isLocating"
        @click="centerOnUser"
      >
        {{ isLocating ? 'Locating...' : 'Center on me' }}
      </button>

      <button
        v-if="destinationCoordinates.length >= 2"
        type="button"
        class="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isLoadingRoute"
        @click="fetchRoute"
      >
        {{ isLoadingRoute ? 'Routing...' : 'Refresh route' }}
      </button>
    </div>

    <p
      v-if="errorMessage"
      class="absolute bottom-3 left-3 right-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 shadow"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
