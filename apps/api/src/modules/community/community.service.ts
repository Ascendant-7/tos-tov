import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import 'multer';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';

type PostVisibility = 'public' | 'friends' | 'private';
type MediaType = 'image' | 'video';

type UserRelationRow = {
  user_id?: string | null;
};

type PostMediaRow = {
  bucket_name?: string | null;
  file_path?: string | null;
  public_url?: string | null;
  media_type?: MediaType | string | null;
  position?: number | null;
};

type CommunityPostRow = {
  id: string;
  user_id: string;
  destination_id?: string | null;
  trip_id?: string | null;
  title?: string | null;
  content?: string | null;
  visit_status?: string | null;
  created_at?: string | null;
  visibility: PostVisibility;
  post_media?: PostMediaRow[] | null;
  post_likes?: UserRelationRow[] | null;
  post_comments?: unknown[] | null;
  saved_posts?: UserRelationRow[] | null;
  feed_id?: string;
  shared_at?: string | null;
  shared_by_user_id?: string | null;
  shared_by_profile?: unknown;
  [key: string]: unknown;
};

type DecoratedCommunityPostRow = CommunityPostRow & {
  liked_by_viewer: boolean;
  saved_by_viewer: boolean;
};

type FriendshipPairRow = {
  requester_id: string;
  receiver_id: string;
};

type SharedPostRow = {
  id: string;
  user_id: string;
  caption?: string | null;
  created_at?: string | null;
  profiles?: unknown;
  community_posts?: CommunityPostRow | CommunityPostRow[] | null;
};

@Injectable()
export class CommunityService {
  private readonly bucketName = 'community-posts';
  private readonly maxImageSize = 10 * 1024 * 1024;
  private readonly maxVideoSize = 50 * 1024 * 1024;
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
  ];
  private storageBucketConfigured = false;

  constructor(private readonly supabaseService: SupabaseService) {}

  private db() {
    return this.supabaseService.adminClient;
  }

  async createPost(
    userId: string,
    dto: CreatePostDto,
  ): Promise<DecoratedCommunityPostRow> {
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
        trip_id: dto.tripId || null,
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

    const post = createdPost;

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
  ): Promise<unknown> {
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

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image and video files are allowed');
    }

    const mediaType: MediaType = file.mimetype.startsWith('image/')
      ? 'image'
      : 'video';
    const maxSize =
      mediaType === 'image' ? this.maxImageSize : this.maxVideoSize;
    const maxSizeLabel = mediaType === 'image' ? '10MB' : '50MB';

    if (file.size > maxSize) {
      throw new BadRequestException(
        `${mediaType === 'image' ? 'Image' : 'Video'} file size must be less than ${maxSizeLabel}`,
      );
    }

    await this.ensureStorageBucketConfigured();

    const extension =
      file.originalname.split('.').pop()?.toLowerCase() || 'bin';
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

  async getPosts(
    userId?: string,
    filter = 'all',
  ): Promise<DecoratedCommunityPostRow[]> {
    const supabase = this.db();
    const normalizedFilter = filter.toLowerCase();
    const friendIds = userId ? await this.getFriendIds(userId) : [];

    const { data: postData, error } = await supabase
      .from('community_posts')
      .select(this.postSelectQuery())
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const { data: shareData, error: shareError } = await (supabase as any)
      .from('shared_posts')
      .select(
        `
        id,
        user_id,
        caption,
        created_at,
        profiles:user_id (
          id,
          first_name,
          last_name,
          email
        ),
        community_posts:post_id (
          ${this.postSelectQuery()}
        )
      `,
      )
      .order('created_at', { ascending: false });

    if (shareError) {
      throw new BadRequestException(shareError.message);
    }

    const posts = ((postData || []) as unknown as CommunityPostRow[])
      .filter((post) => this.canViewPost(post, userId, friendIds))
      .map((post) => ({
        ...post,
        feed_id: post.id,
      }));

    const sharedPosts = ((shareData || []) as SharedPostRow[])
      .map((share) => this.mapSharedPostFeedRow(share))
      .filter((post): post is CommunityPostRow => Boolean(post))
      .filter((post) => this.canViewPost(post, userId, friendIds));

    let feedItems = [...posts, ...sharedPosts].sort((a, b) => {
      const dateA = new Date(a.shared_at || a.created_at || 0).getTime();
      const dateB = new Date(b.shared_at || b.created_at || 0).getTime();

      return dateB - dateA;
    });

    if (normalizedFilter === 'following') {
      if (!userId) return [];

      feedItems = feedItems.filter((post) =>
        friendIds.includes(this.feedOwnerId(post)),
      );
    }

    if (normalizedFilter === 'saved') {
      if (!userId) return [];

      feedItems = feedItems.filter((post) => {
        return (post.saved_posts || []).some(
          (saved) => saved.user_id === userId,
        );
      });
    }

    if (normalizedFilter === 'popular') {
      feedItems = feedItems.sort((a, b) => {
        const scoreA =
          (a.post_likes?.length || 0) * 2 + (a.post_comments?.length || 0);

        const scoreB =
          (b.post_likes?.length || 0) * 2 + (b.post_comments?.length || 0);

        return scoreB - scoreA;
      });
    }

    return feedItems.map((post) => this.decoratePostForViewer(post, userId));
  }

  async getPostById(
    userId: string | undefined,
    postId: string,
  ): Promise<DecoratedCommunityPostRow> {
    const supabase = this.db();
    const friendIds = userId ? await this.getFriendIds(userId) : [];

    const { data, error } = await supabase
      .from('community_posts')
      .select(this.postSelectQuery())
      .eq('id', postId)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      throw new NotFoundException('Post not found');
    }

    const post = data as unknown as CommunityPostRow;

    if (!this.canViewPost(post, userId, friendIds)) {
      throw new NotFoundException('Post not found');
    }

    return this.decoratePostForViewer(post, userId);
  }

  async likePost(userId: string, postId: string) {
    const supabase = this.db();

    await this.ensurePostViewable(userId, postId);

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

    await this.ensurePostViewable(userId, postId);

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

  async sharePost(
    userId: string,
    postId: string,
  ): Promise<DecoratedCommunityPostRow> {
    const supabase = this.db();
    const originalPost = await this.ensurePostViewable(userId, postId);

    const { data: createdShare, error } = await (supabase as any)
      .from('shared_posts')
      .insert({
        user_id: userId,
        post_id: originalPost.id,
      })
      .select(
        `
        id,
        user_id,
        caption,
        created_at,
        profiles:user_id (
          id,
          first_name,
          last_name,
          email
        ),
        community_posts:post_id (
          ${this.postSelectQuery()}
        )
      `,
      )
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!createdShare) {
      throw new BadRequestException('Failed to share post');
    }

    const feedRow = this.mapSharedPostFeedRow(createdShare as SharedPostRow);

    if (!feedRow) {
      throw new BadRequestException('Failed to load shared post');
    }

    return this.decoratePostForViewer(feedRow, userId);
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

  async updatePostVisibility(
    userId: string,
    postId: string,
    visibility: PostVisibility,
  ): Promise<DecoratedCommunityPostRow> {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('community_posts')
      .update({
        visibility,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .eq('status', 'published')
      .select(this.postSelectQuery())
      .single();

    if (error || !data) {
      throw new NotFoundException('Post not found or not owned by user');
    }

    return this.decoratePostForViewer(
      data as unknown as CommunityPostRow,
      userId,
    );
  }

  async getComments(postId: string, userId?: string): Promise<unknown> {
    const supabase = this.db();

    await this.ensurePostViewable(userId, postId);

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

  async findPostById(postId: string): Promise<unknown> {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('community_posts')
      .select(
        `
        *,
        profiles:user_id (
          id,
          first_name,
          last_name
        ),
        destinations:destination_id (
          id,
          name,
          province,
          cover_image_url
        ),
        trips:trip_id (
          id,
          title,
          description,
          created_at
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
      `,
      )
      .eq('id', postId)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      throw new NotFoundException('Post not found');
    }

    return data;
  }

  async createComment(
    userId: string,
    postId: string,
    dto: CreateCommentDto,
  ): Promise<unknown> {
    const supabase = this.db();

    await this.ensurePostViewable(userId, postId);

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

  async toggleLike(postId: string, userId: string) {
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

    if (existingLike) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);

      if (error) {
        throw new BadRequestException(error.message);
      }

      return { liked: false };
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

    return { liked: true, data };
  }

  async getTrendingTags(): Promise<{ tag: string; count: number }[]> {
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

  async searchDestinations(q?: string): Promise<unknown> {
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

  private async ensurePostExists(postId: string): Promise<CommunityPostRow> {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('community_posts')
      .select(
        `
        id,
        user_id,
        destination_id,
        title,
        content,
        visit_status,
        visibility,
        post_media (
          bucket_name,
          file_path,
          public_url,
          media_type,
          position
        )
      `,
      )
      .eq('id', postId)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      throw new NotFoundException('Post not found');
    }

    return data as CommunityPostRow;
  }

  private async ensureStorageBucketConfigured() {
    if (this.storageBucketConfigured) {
      return;
    }

    const { error } = await this.db().storage.updateBucket(this.bucketName, {
      public: true,
      fileSizeLimit: this.maxVideoSize,
      allowedMimeTypes: this.allowedMimeTypes,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    this.storageBucketConfigured = true;
  }

  private async ensurePostViewable(
    userId: string | undefined,
    postId: string,
  ): Promise<CommunityPostRow> {
    const post = await this.ensurePostExists(postId);
    const friendIds = userId ? await this.getFriendIds(userId) : [];

    if (!this.canViewPost(post, userId, friendIds)) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  private async getFriendIds(userId: string): Promise<string[]> {
    const supabase = this.db();

    const { data, error } = await supabase
      .from('friendships')
      .select('requester_id, receiver_id')
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) {
      throw new BadRequestException(error.message);
    }

    return ((data || []) as FriendshipPairRow[]).map((friendship) =>
      friendship.requester_id === userId
        ? friendship.receiver_id
        : friendship.requester_id,
    );
  }

  private canViewPost(
    post: CommunityPostRow,
    userId: string | undefined,
    friendIds: string[],
  ): boolean {
    if (post.visibility === 'public') {
      return true;
    }

    if (!userId) {
      return false;
    }

    if (post.user_id === userId) {
      return true;
    }

    return post.visibility === 'friends' && friendIds.includes(post.user_id);
  }

  private feedOwnerId(post: CommunityPostRow) {
    return post.shared_by_user_id || post.user_id;
  }

  private firstRelation<T>(relation?: T | T[] | null): T | undefined {
    if (Array.isArray(relation)) {
      return relation[0];
    }

    return relation ?? undefined;
  }

  private mapSharedPostFeedRow(share: SharedPostRow): CommunityPostRow | null {
    const originalPost = this.firstRelation(share.community_posts);

    if (!originalPost) {
      return null;
    }

    return {
      ...originalPost,
      feed_id: `share:${share.id}`,
      shared_at: share.created_at ?? null,
      shared_by_user_id: share.user_id,
      shared_by_profile: share.profiles,
      share_caption: share.caption ?? null,
    };
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
      trips:trip_id (
        id,
        title,
        description,
        created_at
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

  private decoratePostForViewer(
    post: CommunityPostRow,
    userId?: string,
  ): DecoratedCommunityPostRow {
    return {
      ...post,
      liked_by_viewer: userId
        ? (post.post_likes || []).some((like) => like.user_id === userId)
        : false,
      saved_by_viewer: userId
        ? (post.saved_posts || []).some((saved) => saved.user_id === userId)
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
