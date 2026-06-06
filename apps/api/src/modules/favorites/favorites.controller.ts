import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import { AuthGuard } from '../../common/guards/auth.guard'
import type { Request } from 'express'
import type { User } from '@repo/supabase'

interface AuthenticatedRequest extends Request {
  user: User
}

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * GET /favorites — return all favorites for the authenticated user
   */
  @Get()
  getFavorites(@Req() req: AuthenticatedRequest) {
    return this.favoritesService.getFavorites(req.user.id)
  }

  /**
   * GET /favorites/check/:destinationId — check if a destination is favorited
   */
  @Get('check/:destinationId')
  checkFavorite(
    @Param('destinationId') destinationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.favoritesService.isFavorited(req.user.id, destinationId)
  }

  /**
   * POST /favorites — add a destination to favorites
   * Body: { destination_id: string }
   */
  @Post()
  addFavorite(
    @Body('destination_id') destinationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.favoritesService.addFavorite(req.user.id, destinationId)
  }

  /**
   * DELETE /favorites/:destinationId — remove a destination from favorites
   */
  @Delete(':destinationId')
  removeFavorite(
    @Param('destinationId') destinationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.favoritesService.removeFavorite(req.user.id, destinationId)
  }
}
