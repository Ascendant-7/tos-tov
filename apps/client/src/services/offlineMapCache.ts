const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const CACHE_NAME = 'tos-tov-osm-tiles-v1'

interface TileCoordinate {
  x: number
  y: number
  z: number
}

interface BoundsInput {
  west: number
  south: number
  east: number
  north: number
}

const longitudeToTileX = (longitude: number, zoom: number) =>
  Math.floor(((longitude + 180) / 360) * 2 ** zoom)

const latitudeToTileY = (latitude: number, zoom: number) => {
  const radians = (latitude * Math.PI) / 180
  return Math.floor(
    ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) * 2 ** zoom,
  )
}

const tileUrl = ({ x, y, z }: TileCoordinate) =>
  OSM_TILE_URL.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y))

export async function cacheMapTilesForBounds(bounds: BoundsInput, zoomLevels = [12, 13, 14]) {
  if (!('caches' in window)) return 0

  const cache = await caches.open(CACHE_NAME)
  const requests: Request[] = []

  zoomLevels.forEach((zoom) => {
    const minX = longitudeToTileX(bounds.west, zoom)
    const maxX = longitudeToTileX(bounds.east, zoom)
    const minY = latitudeToTileY(bounds.north, zoom)
    const maxY = latitudeToTileY(bounds.south, zoom)

    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        requests.push(new Request(tileUrl({ x, y, z: zoom }), { mode: 'no-cors' }))
      }
    }
  })

  await Promise.allSettled(requests.map((request) => cache.add(request)))
  return requests.length
}

export async function clearOfflineMapCache() {
  if (!('caches' in window)) return false
  return caches.delete(CACHE_NAME)
}
