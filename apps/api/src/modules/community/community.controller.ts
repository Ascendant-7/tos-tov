import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

function requireUserId(userId?: string) {
  if (!userId) {
    throw new BadRequestException('Missing x-user-id header');
  }

  return userId;
}

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('posts')
  createPost(
    @Headers('x-user-id') userId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.communityService.createPost(requireUserId(userId), dto);
  }

  @Get('posts')
  getPosts(
    @Headers('x-user-id') userId: string,
    @Query('filter') filter: string = 'all',
  ) {
    return this.communityService.getPosts(userId, filter);
  }

  @Get('posts/:postId')
  getPostById(
    @Headers('x-user-id') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.communityService.getPostById(userId, postId);
  }

  @Post('posts/:postId/like')
  likePost(
    @Headers('x-user-id') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.communityService.likePost(requireUserId(userId), postId);
  }

  @Delete('posts/:postId/like')
  unlikePost(
    @Headers('x-user-id') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.communityService.unlikePost(requireUserId(userId), postId);
  }

  @Post('posts/:postId/save')
  savePost(
    @Headers('x-user-id') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.communityService.savePost(requireUserId(userId), postId);
  }

  @Delete('posts/:postId/save')
  unsavePost(
    @Headers('x-user-id') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.communityService.unsavePost(requireUserId(userId), postId);
  }

  @Get('posts/:postId/comments')
  getComments(@Param('postId') postId: string) {
    return this.communityService.getComments(postId);
  }

  @Post('posts/:postId/comments')
  createComment(
    @Headers('x-user-id') userId: string,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.createComment(
      requireUserId(userId),
      postId,
      dto,
    );
  }

  @Get('trending-tags')
  getTrendingTags() {
    return this.communityService.getTrendingTags();
  }
}