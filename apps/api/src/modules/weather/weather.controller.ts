import { Controller, Get, Param } from '@nestjs/common'
import { WeatherService } from './weather.service'

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getWeather() {
    return this.weatherService.getWeather()
  }

  @Get(':city')
  getWeatherByCity(@Param('city') city: string) {
    return this.weatherService.getWeatherByCity(city)
  }
}
