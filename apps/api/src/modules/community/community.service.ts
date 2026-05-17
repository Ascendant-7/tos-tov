import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommunityService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Temporary until community tables are pushed and Supabase types are regenerated.
   * Later change:
   *   return this.supabaseService.client as any;
   * to:
   *   return this.supabaseService.client;
   */
  private db() {
    return this.supabaseService.client as any;
  }

  async createPost(userId: string, dto: CreatePostDto) {
    const supabase = this.db();

    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content: dto.content,
        destination_name: dto.destinationName ?? null,
        province: dto.province ?? null,
        is_visited: dto.isVisited ?? false,
        visibility: dto.visibility ?? 'public',
      })
      .select()
      .single();

    if (postError) {
      throw new BadRequestException(postError.message);
    }

    if (dto.media && dto.media.length > 0) {
      const mediaRows = dto.media.map((media, index) => ({
        post_id: post.id,
        media_url: media.mediaUrl,
        media_type: media.mediaType,
        storage_path: media.storagePath ?? null,
        display_order: index,
      }));

      const { error: mediaError } = await supabase
        .from('post_media')
        .insert(mediaRows);

      if (mediaError) {
        throw new BadRequestException(mediaError.message);
      }
    }

    if (dto.hashtags && dto.hashtags.length > 0) {
      const hashtagRows = dto.hashtags.map((tag) => ({
        post_id: post.id,
        tag: this.normalizeTag(tag),
      }));

      const { error: hashtagError } = await supabase
        .from('post_hashtags')
        .insert(hashtagRows);

      if (hashtagError) {
        throw new BadRequestException(hashtagError.message);
      }
    }

    return {
      message: 'Post created successfully',
      data: post,
    };
  }

  async getPosts(userId?: string, filter = 'all') {
    const supabase = this.db();

    if (filter === 'saved') {
      if (!userId) {
        throw new BadRequestException('Missing x-user-id header');
      }

      const { data, error } = await supabase
        .from('post_saves')
        .select(`
          post_id,
          posts (
            *,
            post_media (*),
            post_hashtags (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new BadRequestException(error.message);
      }

      return data;
    }

    const query = supabase
      .from('posts')
      .select(`
        *,
        post_media (*),
        post_hashtags (*),
        post_likes (id, user_id),
        post_comments (id)
      `);

    if (filter === 'popular') {
      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) {
        throw new BadRequestException(error.message);
      }

      return this.sortByPopularity(data);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async getPostById(userId: string | undefined, postId: string) {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_media (*),
        post_hashtags (*),
        post_likes (id, user_id),
        post_comments (id, content, user_id, created_at)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return data;
  }

  async likePost(userId: string, postId: string) {
    const supabase = this.db();

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
      message: 'Post liked successfully',
      data,
    };
  }

  async unlikePost(userId: string, postId: string) {
    const supabase = this.db();

    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Post unliked successfully',
    };
  }

  async savePost(userId: string, postId: string) {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('post_saves')
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
      message: 'Post saved successfully',
      data,
    };
  }

  async unsavePost(userId: string, postId: string) {
    const supabase = this.db();

    const { error } = await supabase
      .from('post_saves')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Post unsaved successfully',
    };
  }

  async getComments(postId: string) {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
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

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: dto.content,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Comment created successfully',
      data,
    };
  }

  async getTrendingTags() {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('post_hashtags')
      .select('tag');

    if (error) {
      throw new BadRequestException(error.message);
    }

    const counts = new Map<string, number>();

    for (const row of data) {
      counts.set(row.tag, (counts.get(row.tag) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private normalizeTag(tag: string) {
    return tag.trim().replace(/^#/, '').toLowerCase();
  }

  private sortByPopularity(posts: any[]) {
    return [...posts].sort((a, b) => {
      const aLikes = a.post_likes?.length ?? 0;
      const bLikes = b.post_likes?.length ?? 0;

      return bLikes - aLikes;
    });
  }
}