import { Injectable, NotFoundException } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class WeatherService {
  private readonly cities = [
    { name: 'Phnom Penh', latitude: 11.5564, longitude: 104.9282 },
    { name: 'Siem Reap', latitude: 13.3671, longitude: 103.8448 },
    { name: 'Kampot', latitude: 10.6104, longitude: 104.1815 },
    { name: 'Koh Rong', latitude: 10.6933, longitude: 103.2872 },
  ]

  async getWeather() {
    const weatherData = await Promise.all(
      this.cities.map(async (city) => {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code`,
          { timeout: 5000 },
        )

        return {
          city: city.name,
          temperature: response.data.current.temperature_2m,
          weatherCode: response.data.current.weather_code,
        }
      }),
    )

    return weatherData
  }

  async getWeatherByCity(cityName: string) {
    const formattedCity = cityName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    const geoResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(formattedCity)}&count=1`,
      { timeout: 5000 },
    )

    if (!geoResponse.data.results?.length) {
      throw new NotFoundException('City not found')
    }

    const city = geoResponse.data.results[0]

    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code`,
      { timeout: 5000 },
    )

    return {
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      temperature: weatherResponse.data.current.temperature_2m,
      weatherCode: weatherResponse.data.current.weather_code,
    }
  }
}
