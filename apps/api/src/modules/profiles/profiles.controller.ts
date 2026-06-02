import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProfilesService } from './profiles.service'

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  search(@Query('q') q?: string) {
    return this.profilesService.search(q ?? '')
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.profilesService.getById(id)
  }
}
