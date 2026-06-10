import { ref } from 'vue'

export function useUserLocation() {
  const coordinates = ref<[number, number] | null>(null)
  const isLocating = ref(false)
  const locationError = ref('')

  const requestLocation = () =>
    new Promise<[number, number]>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not available in this browser.'))
        return
      }

      isLocating.value = true
      locationError.value = ''

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextCoordinates: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ]
          coordinates.value = nextCoordinates
          isLocating.value = false
          resolve(nextCoordinates)
        },
        (error) => {
          locationError.value = error.message || 'Unable to get your current location.'
          isLocating.value = false
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })

  return {
    coordinates,
    isLocating,
    locationError,
    requestLocation,
  }
}
