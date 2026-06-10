<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import maplibregl, { type Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const mapElement = ref<HTMLElement | null>(null)

let map: Map | null = null

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

  console.log(`[MapLibreOsmRasterExample] ${eventName}`, {
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
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')

  map.on('load', () => logMapDiagnostics('load'))
  map.on('error', (event) => {
    console.error('[MapLibreOsmRasterExample] error', event)
    logMapDiagnostics('error', { message: 'map error event fired' })
  })
  map.on('styledata', (event) => {
    logMapDiagnostics('styledata', {
      styleType: event.dataType,
    })
  })
  map.on('sourcedata', (event) => {
    console.log('[MapLibreOsmRasterExample] sourcedata', {
      sourceId: event.sourceId,
      sourceDataType: event.sourceDataType,
      isSourceLoaded: event.isSourceLoaded,
      sourceExists: event.sourceId ? Boolean(map?.getSource(event.sourceId)) : false,
    })
  })
}

onMounted(() => {
  void initializeMap()
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div class="relative min-h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
    <div ref="mapElement" class="h-[420px] w-full"></div>
  </div>
</template>