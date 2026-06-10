import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import 'multer'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { User } from '@repo/supabase'
import { CommunityService } from './community.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { AuthGuard } from '../../common/guards/auth.guard'
import { SupabaseService } from '../../supabase/supabase.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostVisibilityDto } from './dto/update-post-visibility.dto'
import { UploadPostMediaDto } from './dto/upload-post-media.dto'
import { UpdatePostDto } from './dto/update-post.dto'

interface AuthenticatedRequest extends Request {
  user: User
}

function requireUserId(req: AuthenticatedRequest) {
  if (!req.user?.id) {
    throw new BadRequestException('Missing authenticated user')
  }

  return req.user.id
}

@Controller('community')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly supabaseService: SupabaseService,
  ) {}

  private async getOptionalUserId(authorization?: string) {
    const token = authorization?.replace('Bearer ', '')

    if (!token) {
      return undefined
    }

    const { data, error } = await this.supabaseService.anonClient.auth.getUser(token)

    if (error) {
      return undefined
    }

    return data.user?.id
  }

  @Post('posts')
  @UseGuards(AuthGuard)
  createPost(@Req() req: AuthenticatedRequest, @Body() dto: CreatePostDto) {
    return this.communityService.createPost(requireUserId(req), dto)
  }

  @Post('posts/:postId/media')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadPostMedia(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
    @Query() query: UploadPostMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.communityService.uploadPostMedia(
      requireUserId(req),
      postId,
      file,
      Number(query.position ?? 0),
    )
  }

  @Get('posts')
  async getPosts(
    @Headers('authorization') authorization?: string,
    @Query('filter') filter: string = 'all',
  ) {
    const userId = await this.getOptionalUserId(authorization)

    return this.communityService.getPosts(userId, filter)
  }

  @Get('destinations/search')
  searchDestinations(@Query('q') q?: string) {
    return this.communityService.searchDestinations(q)
  }

  @Get('trending-tags')
  getTrendingTags() {
    return this.communityService.getTrendingTags()
  }

  @Get('posts/:postId')
  async getPostById(
    @Headers('authorization') authorization: string | undefined,
    @Param('postId') postId: string,
  ) {
    const userId = await this.getOptionalUserId(authorization)

    return this.communityService.getPostById(userId, postId)
  }

  @Post('posts/:postId/like')
  @UseGuards(AuthGuard)
  likePost(@Req() req: AuthenticatedRequest, @Param('postId') postId: string) {
    return this.communityService.likePost(requireUserId(req), postId)
  }

  @Delete('posts/:postId/like')
  @UseGuards(AuthGuard)
  unlikePost(@Req() req: AuthenticatedRequest, @Param('postId') postId: string) {
    return this.communityService.unlikePost(requireUserId(req), postId)
  }

  @Post('posts/:postId/save')
  @UseGuards(AuthGuard)
  savePost(@Req() req: AuthenticatedRequest, @Param('postId') postId: string) {
    return this.communityService.savePost(requireUserId(req), postId)
  }

  @Post('posts/:postId/share')
  @UseGuards(AuthGuard)
  sharePost(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
    @Body('caption') caption?: string,
  ) {
    return this.communityService.sharePost(requireUserId(req), postId, caption)
  }

  @Delete('posts/:postId/save')
  @UseGuards(AuthGuard)
  unsavePost(@Req() req: AuthenticatedRequest, @Param('postId') postId: string) {
    return this.communityService.unsavePost(requireUserId(req), postId)
  }

  @Delete('posts/:postId')
  @UseGuards(AuthGuard)
  deletePost(@Req() req: AuthenticatedRequest, @Param('postId') postId: string) {
    return this.communityService.deletePost(requireUserId(req), postId)
  }

  @Patch('posts/:postId')
  @UseGuards(AuthGuard)
  updatePost(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.communityService.updatePost(requireUserId(req), postId, dto)
  }

  @Patch('posts/:postId/visibility')
  @UseGuards(AuthGuard)
  updatePostVisibility(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostVisibilityDto,
  ) {
    return this.communityService.updatePostVisibility(requireUserId(req), postId, dto.visibility)
  }

  @Get('posts/:postId/comments')
  async getComments(
    @Headers('authorization') authorization: string | undefined,
    @Param('postId') postId: string,
  ) {
    const userId = await this.getOptionalUserId(authorization)

    return this.communityService.getComments(postId, userId)
  }

  @Post('posts/:postId/comments')
  @UseGuards(AuthGuard)
  createComment(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.createComment(requireUserId(req), postId, dto)
  }
}
