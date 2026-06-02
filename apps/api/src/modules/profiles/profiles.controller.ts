import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { AuthGuard } from '../../common/guards/auth.guard'
import { UpdateProfileDto } from './dto/update-profile.dto'
import type { Request } from 'express'
import type { User } from '@repo/supabase'

interface AuthenticatedRequest extends Request {
  user: User
}

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('stats/:id')
  getStats(@Param('id') id: string) {
    return this.profilesService.getStats(id)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.profilesService.getById(id)
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user?.id !== id) {
      throw new ForbiddenException('You can only update your own profile')
    }

    return this.profilesService.updateById(id, dto)
  }
}
