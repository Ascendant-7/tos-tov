import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommunityService {
  private readonly bucketName = 'community-posts';

  constructor(private readonly supabaseService: SupabaseService) {}

  private db() {
    return this.supabaseService.adminClient;
  }

async createPost(userId: string, dto: CreatePostDto) {
  const supabase = this.db();

  const destinationId =
    dto.destinationId ??
    (await this.findDestinationIdByName(dto.destinationName, dto.province));

  const visitStatus = dto.isVisited === false ? 'want_to_go' : 'visited';

  const { data: createdPost, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: userId,
      destination_id: destinationId,
      title: dto.title?.trim() || null,
      content: dto.content,
      visit_status: visitStatus,
      visibility: dto.visibility ?? 'public',
      status: 'published',
    })
    .select('id')
    .single();

  if (error) {
    throw new BadRequestException(error.message);
  }

  if (!createdPost) {
    throw new BadRequestException('Failed to create post');
  }

  const post = createdPost as { id: string };

  if (dto.media && dto.media.length > 0) {
    for (let i = 0; i < dto.media.length; i++) {
      const media = dto.media[i];

      const { error: mediaError } = await supabase.from('post_media').insert({
        post_id: post.id,
        bucket_name: 'external',
        file_path: media.storagePath ?? media.mediaUrl,
        public_url: media.mediaUrl,
        media_type: media.mediaType,
        position: i,
      });

      if (mediaError) {
        throw new BadRequestException(mediaError.message);
      }
    }
  }

  return this.getPostById(userId, post.id);
}

  async uploadPostMedia(
    userId: string,
    postId: string,
    file: Express.Multer.File,
    position: number,
  ) {
    const supabase = this.db();

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('id, user_id')
      .eq('id', postId)
      .eq('user_id', userId)
      .single();

    if (postError || !post) {
      throw new NotFoundException('Post not found or not owned by user');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image and video files are allowed');
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 20MB');
    }

    const extension = file.originalname.split('.').pop()?.toLowerCase() || 'bin';
    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
    const filePath = `${postId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw new BadRequestException(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    const mediaType = file.mimetype.startsWith('image/') ? 'image' : 'video';

    const { data, error } = await supabase
      .from('post_media')
      .insert({
        post_id: postId,
        bucket_name: this.bucketName,
        file_path: filePath,
        public_url: publicUrlData.publicUrl,
        media_type: mediaType,
        position,
      })
      .select()
      .single();

    if (error) {
      await supabase.storage.from(this.bucketName).remove([filePath]);
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async getPosts(userId?: string, filter = 'all') {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('community_posts')
      .select(this.postSelectQuery())
      .eq('status', 'published')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(error.message);
    }

    let posts = data || [];

    if (filter === 'saved') {
      if (!userId) return [];

      posts = posts.filter((post: any) => {
        return (post.saved_posts || []).some(
          (saved: any) => saved.user_id === userId,
        );
      });
    }

    if (filter === 'popular') {
      posts = posts.sort((a: any, b: any) => {
        const scoreA =
          (a.post_likes?.length || 0) * 2 + (a.post_comments?.length || 0);

        const scoreB =
          (b.post_likes?.length || 0) * 2 + (b.post_comments?.length || 0);

        return scoreB - scoreA;
      });
    }

    if (filter === 'following') {
      posts = posts.filter((post: any) => post.user_id !== userId);
    }

    return posts.map((post: any) => this.decoratePostForViewer(post, userId));
  }

  async getPostById(userId: string | undefined, postId: string) {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('community_posts')
      .select(this.postSelectQuery())
      .eq('id', postId)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      throw new NotFoundException('Post not found');
    }

    return this.decoratePostForViewer(data, userId);
  }

  async likePost(userId: string, postId: string) {
    const supabase = this.db();

    await this.ensurePostExists(postId);

    const { data: existingLike, error: findError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (findError) {
      throw new BadRequestException(findError.message);
    }

    if (existingLike) {
      return {
        liked: true,
        message: 'Post already liked',
      };
    }

    const { data, error } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      liked: true,
      data,
      message: 'Post liked successfully',
    };
  }

  async unlikePost(userId: string, postId: string) {
    const supabase = this.db();

    const { data: existingLike, error: findError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (findError) {
      throw new BadRequestException(findError.message);
    }

    if (!existingLike) {
      return {
        liked: false,
        message: 'Post already unliked',
      };
    }

    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('id', existingLike.id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      liked: false,
      message: 'Post unliked successfully',
    };
  }

  async savePost(userId: string, postId: string) {
    const supabase = this.db();

    await this.ensurePostExists(postId);

    const { data: existingSave, error: findError } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (findError) {
      throw new BadRequestException(findError.message);
    }

    if (existingSave) {
      return {
        saved: true,
        message: 'Post already saved',
      };
    }

    const { data, error } = await supabase
      .from('saved_posts')
      .insert({
        post_id: postId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      saved: true,
      data,
      message: 'Post saved successfully',
    };
  }

  async unsavePost(userId: string, postId: string) {
    const supabase = this.db();

    const { data: existingSave, error: findError } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (findError) {
      throw new BadRequestException(findError.message);
    }

    if (!existingSave) {
      return {
        saved: false,
        message: 'Post already unsaved',
      };
    }

    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('id', existingSave.id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      saved: false,
      message: 'Post unsaved successfully',
    };
  }

  async deletePost(userId: string, postId: string) {
    const supabase = this.db();

    const { data: post, error: findError } = await supabase
      .from('community_posts')
      .select('id, user_id')
      .eq('id', postId)
      .single();

    if (findError || !post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user_id !== userId) {
      throw new BadRequestException('You can only delete your own posts');
    }

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      deleted: true,
      message: 'Post deleted successfully',
    };
  }

  async getComments(postId: string) {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('post_comments')
      .select(
        `
        id,
        content,
        created_at,
        profiles:user_id (
          id,
          first_name,
          last_name,
          email
        )
      `,
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async createComment(
    userId: string,
    postId: string,
    dto: CreateCommentDto,
  ) {
    const supabase = this.db();

    await this.ensurePostExists(postId);

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: dto.content,
      })
      .select(
        `
        id,
        post_id,
        user_id,
        content,
        created_at,
        profiles:user_id (
          id,
          first_name,
          last_name,
          email
        )
      `,
      )
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async getTrendingTags() {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('community_posts')
      .select('content')
      .eq('status', 'published')
      .eq('visibility', 'public');

    if (error) {
      throw new BadRequestException(error.message);
    }

    const tagMap = new Map<string, number>();

    for (const post of data || []) {
      const matches = post.content?.match(/#[\p{L}\p{N}_]+/gu) || [];

      for (const tag of matches) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }

    return [...tagMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({
        tag,
        count,
      }));
  }

  async searchDestinations(q?: string) {
    const supabase = this.db();
    const query = q?.trim();

    let request = supabase
      .from('destinations')
      .select('id, name, province, location_name, category, cover_image_url')
      .order('name', { ascending: true })
      .limit(10);

    if (query) {
      const safeQuery = query
        .replace(/[,%()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      request = request.or(
        [
          `name.ilike.%${safeQuery}%`,
          `province.ilike.%${safeQuery}%`,
          `location_name.ilike.%${safeQuery}%`,
          `category.ilike.%${safeQuery}%`,
        ].join(','),
      );
    }

    const { data, error } = await request;

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  private async ensurePostExists(postId: string) {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('community_posts')
      .select('id')
      .eq('id', postId)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      throw new NotFoundException('Post not found');
    }

    return data;
  }

  private postSelectQuery() {
    return `
      *,
      profiles:user_id (
        id,
        first_name,
        last_name,
        email
      ),
      destinations:destination_id (
        id,
        name,
        province,
        location_name,
        cover_image_url
      ),
      post_media (
        id,
        bucket_name,
        file_path,
        public_url,
        media_type,
        position
      ),
      post_comments (
        id,
        content,
        created_at,
        profiles:user_id (
          id,
          first_name,
          last_name
        )
      ),
      post_likes (
        id,
        user_id
      ),
      saved_posts (
        id,
        user_id
      )
    `;
  }

  private decoratePostForViewer(post: any, userId?: string) {
    return {
      ...post,
      liked_by_viewer: userId
        ? (post.post_likes || []).some((like: any) => like.user_id === userId)
        : false,
      saved_by_viewer: userId
        ? (post.saved_posts || []).some((saved: any) => saved.user_id === userId)
        : false,
    };
  }

  private async findDestinationIdByName(
  destinationName?: string,
  province?: string,
) {
  if (!destinationName) {
    return null;
  }

  const supabase = this.db();

  let query = supabase
    .from('destinations')
    .select('id')
    .ilike('name', destinationName)
    .limit(1);

  if (province) {
    query = query.ilike('province', province);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new BadRequestException(error.message);
  }

  return data?.id ?? null;
}
}
