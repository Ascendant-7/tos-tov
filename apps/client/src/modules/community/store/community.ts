import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { supabase } from '@/core/services/supabase'


export interface Comment {
  id: string
  userName: string
  userInitials: string
  text: string
}

export interface Post {
  id: string
  postId: string
  userId: string
  userName: string
  userInitials: string
  location: string
  timeAgo: string
  image: string
  images: string[]
  media: PostMedia[]
  title: string
  description: string
  likes: number
  comments: Comment[]
  hashtags: string[]
  liked: boolean
  bookmarked: boolean
  visibility: PostVisibility
  shares: number
  sharedPost: SharedPost | null
  destinationId?: string | null
  tripId?: string | null
  tripTitle?: string | null
}

export type PostVisibility = 'public' | 'friends' | 'private'

export interface SharedPost {
  id: string
  userName: string
  title: string
  description: string
}

export interface PostMedia {
  url: string
  type: 'image' | 'video'
}

export interface CommunityUser {
  id: string
  name: string
  initials: string
  hasStory: boolean
}

interface ProfileRow {
  id?: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
}

interface DestinationRow {
  id?: string
  name?: string | null
  province?: string | null
  location_name?: string | null
  cover_image_url?: string | null
  category?: string | null
}

interface MediaRow {
  public_url?: string | null
  media_type?: string | null
  position?: number | null
}

interface CommentRow {
  id: string
  post_id?: string
  user_id?: string
  content?: string | null
  created_at?: string | null
  profiles?: ProfileRow | ProfileRow[] | null
}

interface CommunityPostRow {
  id: string
  user_id?: string | null
  destination_id?: string | null
  trip_id?: string | null
  title?: string | null
  content?: string | null
  created_at?: string | null
  profiles?: ProfileRow | ProfileRow[] | null
  destinations?: DestinationRow | DestinationRow[] | null
  trips?: { id: string; title: string } | { id: string; title: string }[] | null
  post_media?: MediaRow[] | null
  post_comments?: CommentRow[] | null
  post_likes?: { user_id?: string | null }[] | null
  saved_posts?: { user_id?: string | null }[] | null
  shared_posts?: { id: string }[] | null
  liked_by_viewer?: boolean
  saved_by_viewer?: boolean
  visibility?: PostVisibility | null
  feed_id?: string
  shared_at?: string | null
  shared_by_user_id?: string | null
  shared_by_profile?: ProfileRow | ProfileRow[] | null
  share_caption?: string | null
}

interface FriendOverviewRow {
  friendshipId: string
  profile: ProfileRow
}

interface TrendingTagRow {
  tag: string
  count: number
}

export type FeedbackType = 'success' | 'info' | 'warning' | 'error'

export interface DestinationOption {
  id: string
  name: string
  province: string
  locationName: string
  coverImageUrl?: string
  category?: string
}

export interface CreatePostInput {
  title?: string
  content: string
  hashtags?: string[]
  destinationId?: string
  destinationName?: string
  province?: string
  isVisited?: boolean
  visibility?: PostVisibility
  tripId?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop'

const api = axios.create({
  baseURL: API_BASE_URL,
})

let messageTimer: ReturnType<typeof window.setTimeout> | null = null
let cachedToken: string | null = null

const authHeaders = () => {
  return cachedToken ? { Authorization: `Bearer ${cachedToken}` } : undefined
}

const requireAuthHeaders = () => {
  const headers = authHeaders()

  if (!headers) {
    throw new Error('Please log in to use this feature.')
  }

  return headers
}

const isAuthFailure = (error: unknown) => {
  if (error instanceof Error && error.message === 'Please log in to use this feature.') {
    return true
  }

  if (!axios.isAxiosError(error)) {
    return false
  }

  const status = error.response?.status
  if (status === 401) {
    return true
  }

  const responseMessage = String(error.response?.data?.message ?? '').toLowerCase()

  if (status === 403 && responseMessage.includes('forbidden resource')) {
    return true
  }

  return false
}

const authActionMessage = (action: 'like' | 'comment') =>
  action === 'like' ? 'Please log in to like posts.' : 'Please log in to comment.'


const firstRelation = <T>(relation?: T | T[] | null): T | undefined => {
  if (Array.isArray(relation)) {
    return relation[0]
  }

  return relation ?? undefined
}

const initialsFor = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TT'

const displayNameFor = (profile?: ProfileRow) => {
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim()

  return name || profile?.email || 'Traveler'
}

const timeAgo = (value?: string | null) => {
  if (!value) {
    return 'now'
  }

  const createdAt = new Date(value).getTime()
  const diffSeconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000))

  if (diffSeconds < 60) return 'now'
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`

  return new Date(value).toLocaleDateString()
}

const extractHashtags = (content: string) => content.match(/#[\p{L}\p{N}_]+/gu) ?? []

const mapPost = (row: CommunityPostRow): Post => {
  const profile = firstRelation(row.profiles)
  const destination = firstRelation(row.destinations)
  const sharedByProfile = firstRelation(row.shared_by_profile)
  const originalUserName = displayNameFor(profile)
  const userName = row.shared_by_user_id ? displayNameFor(sharedByProfile) : originalUserName
  const content = row.content ?? ''
  const media =
    row.post_media
      ?.filter((media) => ['image', 'video'].includes(media.media_type ?? '') && media.public_url)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map<PostMedia>((media) => ({
        url: media.public_url as string,
        type: media.media_type === 'video' ? 'video' : 'image',
      })) ?? []
  const images = media.filter((item) => item.type === 'image').map((item) => item.url)
  const fallbackMedia: PostMedia = {
    url: destination?.cover_image_url ?? FALLBACK_IMAGE,
    type: 'image',
  }

  const location =
    [destination?.name, destination?.province].filter(Boolean).join(', ') || 'Cambodia'
  const trip = firstRelation(row.trips)

  return {
    id: row.feed_id ?? row.id,
    postId: row.id,
    userId: row.shared_by_user_id ?? row.user_id ?? '',
    userName,
    userInitials: initialsFor(userName),
    location,
    timeAgo: timeAgo(row.shared_at ?? row.created_at),
    image: images[0] ?? media[0]?.url ?? destination?.cover_image_url ?? FALLBACK_IMAGE,
    images: images.length > 0 ? images : [destination?.cover_image_url ?? FALLBACK_IMAGE],
    media: media.length > 0 ? media : [fallbackMedia],
    title: row.title?.trim() ?? '',
    description: row.shared_by_user_id ? (row.share_caption ?? '') : content,
    likes: row.post_likes?.length ?? 0,
    shares: row.shared_posts?.length ?? 0,
    comments:
      row.post_comments?.map((comment) => {
        const commentProfile = firstRelation(comment.profiles)
        const commentUserName = displayNameFor(commentProfile)

        return {
          id: comment.id,
          userName: commentUserName,
          userInitials: initialsFor(commentUserName),
          text: comment.content ?? '',
        }
      }) ?? [],
    hashtags: extractHashtags(row.shared_by_user_id ? (row.share_caption ?? '') : content),
    liked: row.liked_by_viewer ?? false,
    bookmarked: row.saved_by_viewer ?? false,
    visibility: row.visibility ?? 'public',
    sharedPost: row.shared_by_user_id
      ? {
          id: row.id,
          userName: originalUserName,
          title: row.title?.trim() ?? '',
          description: content,
        }
      : null,
    destinationId: row.destination_id ?? null,
    tripId: row.trip_id ?? null,
    tripTitle: trip?.title ?? null,
  }
}

const mapDestination = (row: DestinationRow): DestinationOption | null => {
  if (!row.id || !row.name) {
    return null
  }

  return {
    id: row.id,
    name: row.name,
    province: row.province ?? '',
    locationName: row.location_name ?? '',
    coverImageUrl: row.cover_image_url ?? undefined,
    category: row.category ?? undefined,
  }
}

const mapComment = (row: CommentRow): Comment => {
  const profile = firstRelation(row.profiles)
  const userName = displayNameFor(profile)

  return {
    id: row.id,
    userName,
    userInitials: initialsFor(userName),
    text: row.content ?? '',
  }
}

const mapCommunityUser = (friend: FriendOverviewRow): CommunityUser => {
  const profile = firstRelation(friend.profile)
  const name = displayNameFor(profile)

  return {
    id: profile?.id ?? friend.friendshipId,
    name,
    initials: initialsFor(name),
    hasStory: false,
  }
}

export const useCommunityStore = defineStore('community', () => {
  const activeFilter = ref('All')
  const selectedTag = ref<string | null>(null)
  const searchQuery = ref('')
  const currentUserId = ref('')
  const currentUserProfile = ref<{ first_name?: string | null; last_name?: string | null; email?: string | null; avatar_url?: string | null } | null>(null)

  const initAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      cachedToken = session.access_token
      currentUserId.value = session.user?.id ?? ''
    } else {
      cachedToken = null
      currentUserId.value = ''
    }
  }
  void initAuth()

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      cachedToken = session.access_token
      currentUserId.value = session.user?.id ?? ''
    } else {
      cachedToken = null
      currentUserId.value = ''
    }
  })

  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const isSearchingDestinations = ref(false)
  const feedbackMessage = ref('')
  const feedbackType = ref<FeedbackType>('info')
  const showCreatePostModal = ref(false)


  const clearMessages = () => {
    feedbackMessage.value = ''

    if (messageTimer) {
      window.clearTimeout(messageTimer)
      messageTimer = null
    }
  }

  const showFeedback = (message: string, type: FeedbackType = 'info', duration = 3200) => {
    clearMessages()
    feedbackMessage.value = message
    feedbackType.value = type
    messageTimer = window.setTimeout(clearMessages, duration)
  }

  const showError = (message: string) => {
    showFeedback(message, 'error', 5000)
  }

  const filterTabs = ['All', 'Following', 'Popular', 'Saved']
  const trendingTags = ref<string[]>([
    '#AngkorWat',
    '#KohRong',
    '#Kampot',
    '#PhnomPenh',
    '#HiddenGems',
    '#CambodiaTravelTips',
  ])
  const communityUsers = ref<CommunityUser[]>([])
  const posts = ref<Post[]>([])
  const destinationResults = ref<DestinationOption[]>([])
  const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())

  const postMatchesSearch = (post: Post, query: string) => {
    const searchableText = [
      post.userName,
      post.location,
      post.title,
      post.description,
      post.sharedPost?.userName,
      post.sharedPost?.title,
      post.sharedPost?.description,
      ...post.hashtags,
      ...post.comments.map((comment) => `${comment.userName} ${comment.text}`),
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(query)
  }

  const filteredPosts = computed(() => {
    let result = posts.value

    if (selectedTag.value) {
      result = result.filter((post) => post.hashtags.includes(selectedTag.value as string))
    }

    if (normalizedSearchQuery.value) {
      result = result.filter((post) => postMatchesSearch(post, normalizedSearchQuery.value))
    }

    return result
  })

  const apiFilter = () => activeFilter.value.toLowerCase()

  const loadPosts = async () => {
    await initAuth()
    isLoading.value = true
    clearMessages()

    try {
      const response = await api.get<CommunityPostRow[]>('/community/posts', {
        params: { filter: apiFilter() },
        headers: authHeaders(),
      })

      posts.value = response.data.map(mapPost)
    } catch (error) {
      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to load community posts.'
          : 'Failed to load community posts.',
      )
    } finally {
      isLoading.value = false
    }
  }

  const loadTrendingTags = async () => {
    try {
      const response = await api.get<TrendingTagRow[]>('/community/trending-tags')
      const tags = response.data.map((item) => item.tag)

      if (tags.length > 0) {
        trendingTags.value = tags
      }
    } catch {
      // Keep the local defaults when the backend has no tags yet.
    }
  }

  const loadCommunityUsers = async () => {
    const headers = authHeaders()

    if (!headers) {
      communityUsers.value = []
      return
    }

    try {
      const response = await api.get<{ friends?: FriendOverviewRow[] }>('/friends/overview', {
        headers,
      })

      communityUsers.value = (response.data.friends ?? []).map(mapCommunityUser)
    } catch {
      communityUsers.value = []
    }
  }

  const loadCurrentUserProfile = async () => {
    const headers = authHeaders()
    if (!headers || !currentUserId.value) {
      currentUserProfile.value = null
      return
    }
    try {
      const response = await api.get(`/profiles/${currentUserId.value}`, {
        headers,
      })
      currentUserProfile.value = response.data
    } catch {
      // fallback to session info
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        currentUserProfile.value = {
          first_name: session.user.user_metadata?.first_name || '',
          last_name: session.user.user_metadata?.last_name || '',
          email: session.user.email || '',
        }
      }
    }
  }

  const loadCommunity = async () => {
    await Promise.all([loadPosts(), loadTrendingTags(), loadCommunityUsers(), loadCurrentUserProfile()])
  }

  const setActiveFilter = (filter: string) => {
    activeFilter.value = filter
    void loadPosts()
  }

  const setSelectedTag = (tag: string | null) => {
    selectedTag.value = selectedTag.value === tag ? null : tag
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const searchDestinations = async (query: string = '') => {
    const trimmedQuery = query.trim()
    isSearchingDestinations.value = true

    try {
      const response = await api.get<DestinationRow[]>('/community/destinations/search', {
        params: trimmedQuery ? { q: trimmedQuery } : {},
      })

      destinationResults.value = response.data
        .map(mapDestination)
        .filter((destination): destination is DestinationOption => Boolean(destination))
    } catch (error) {
      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to search destinations.'
          : 'Failed to search destinations.',
      )
    } finally {
      isSearchingDestinations.value = false
    }
  }

  const toggleLike = async (postId: string) => {
    const post = posts.value.find((item) => item.id === postId)

    if (!post) return

    if (!authHeaders()) {
      showError(authActionMessage('like'))
      return
    }

    const wasLiked = post.liked
    post.liked = !wasLiked
    post.likes += wasLiked ? -1 : 1
    clearMessages()

    try {
      if (wasLiked) {
        await api.delete(`/community/posts/${postId}/like`, { headers: requireAuthHeaders() })
      } else {
        await api.post(`/community/posts/${postId}/like`, undefined, {
          headers: requireAuthHeaders(),
        })
      }
    } catch (error) {
      post.liked = wasLiked
      post.likes += wasLiked ? 1 : -1
      showError(
        isAuthFailure(error)
          ? authActionMessage('like')
          : error instanceof Error
            ? error.message
            : 'Failed to update like.',
      )
    }
  }

  const toggleBookmark = async (postId: string) => {
    const post = posts.value.find((item) => item.id === postId)

    if (!post) return

    const wasBookmarked = post.bookmarked
    post.bookmarked = !wasBookmarked
    clearMessages()

    try {
      if (wasBookmarked) {
        await api.delete(`/community/posts/${postId}/save`, { headers: requireAuthHeaders() })
        showFeedback('Removed from saved.', 'info')
      } else {
        await api.post(`/community/posts/${postId}/save`, undefined, {
          headers: requireAuthHeaders(),
        })
        showFeedback('Post saved.', 'success')
      }
    } catch (error) {
      post.bookmarked = wasBookmarked
      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Please log in to save posts.'
          : 'Please log in to save posts.',
      )
    }
  }

  const uploadPostFiles = async (postId: string, files: File[]) => {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index]

      if (!file) continue

      const formData = new FormData()
      formData.append('file', file)

      await api.post(`/community/posts/${postId}/media`, formData, {
        params: { position: index },
        headers: requireAuthHeaders(),
      })
    }
  }

  const addPost = async (input: CreatePostInput, files: File[] = []) => {
    isSubmitting.value = true
    clearMessages()

    try {
      const response = await api.post<CommunityPostRow>(
        '/community/posts',
        {
          title: input.title,
          content: input.content,
          hashtags: input.hashtags ?? [],
          destinationId: input.destinationId,
          destinationName: input.destinationName,
          province: input.province,
          isVisited: input.isVisited ?? true,
          visibility: input.visibility ?? 'public',
          tripId: input.tripId,
        },
        { headers: requireAuthHeaders() },
      )

      if (files.length > 0) {
        await uploadPostFiles(response.data.id, files)
      }

      await loadPosts()
      void loadTrendingTags()
      showFeedback(files.length > 0 ? 'Post created with media.' : 'Post created.', 'success')

      return posts.value.find((post) => post.id === response.data.id) ?? mapPost(response.data)
    } catch (error) {
      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              'Post was created only if the request reached the server. Please try again.'
          : 'Please log in to create posts.',
      )

      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const sharePost = async (postId: string, caption?: string) => {
    if (!authHeaders()) {
      showError('Please log in to share posts.')
      return
    }

    try {
      clearMessages()

      const response = await api.post<CommunityPostRow>(
        `/community/posts/${postId}/share`,
        { caption },
        { headers: requireAuthHeaders() },
      )

      await loadPosts()
      showFeedback('Post shared to the community feed.', 'success')

      return posts.value.find((post) => post.id === response.data.id) ?? mapPost(response.data)
    } catch (error) {
      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to share post.'
          : 'Failed to share post.',
      )

      throw error
    }
  }

  const addComment = async (postId: string, text: string) => {
    try {
      if (!authHeaders()) {
        showError(authActionMessage('comment'))
        return
      }

      clearMessages()

      const response = await api.post<CommentRow>(
        `/community/posts/${postId}/comments`,
        { content: text },
        { headers: requireAuthHeaders() },
      )

      const post = posts.value.find((item) => item.id === postId)

      if (post) {
        post.comments.push(mapComment(response.data))
      }
    } catch (error) {
      showError(
        isAuthFailure(error)
          ? authActionMessage('comment')
          : error instanceof Error
            ? error.message
            : 'Failed to add comment.',
      )

      throw error
    }
  }

  const deletePost = async (postId: string) => {
    try {
      clearMessages()
      await api.delete(`/community/posts/${postId}`, { headers: requireAuthHeaders() })
      posts.value = posts.value.filter((post) => post.id !== postId)
      showFeedback('Post deleted.', 'warning')
    } catch (error) {
      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to delete post.'
          : 'Failed to delete post.',
      )

      throw error
    }
  }

  const updatePostVisibility = async (postId: string, visibility: PostVisibility) => {
    const post = posts.value.find((item) => item.id === postId)
    const previousVisibility = post?.visibility

    if (post) {
      post.visibility = visibility
    }

    try {
      clearMessages()

      const response = await api.patch<CommunityPostRow>(
        `/community/posts/${postId}/visibility`,
        { visibility },
        { headers: requireAuthHeaders() },
      )
      const updatedPost = mapPost(response.data)
      const index = posts.value.findIndex((item) => item.id === postId)

      if (index >= 0) {
        posts.value[index] = updatedPost
      }

      showFeedback('Post privacy updated.', 'success')
    } catch (error) {
      if (post && previousVisibility) {
        post.visibility = previousVisibility
      }

      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to update privacy.'
          : 'Failed to update privacy.',
      )

      throw error
    }
  }

  const updatePost = async (
    postId: string,
    data: { title?: string; content?: string; caption?: string },
  ) => {
    try {
      clearMessages()
      const response = await api.patch<CommunityPostRow>(
        `/community/posts/${postId}`,
        data,
        { headers: requireAuthHeaders() },
      )
      const updatedPost = mapPost(response.data)
      const index = posts.value.findIndex((item) => item.id === postId)

      if (index >= 0) {
        posts.value[index] = updatedPost
      }

      showFeedback('Post updated successfully.', 'success')
      return updatedPost
    } catch (error) {
      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to update post.'
          : 'Failed to update post.',
      )

      throw error
    }
  }

  return {
    activeFilter,
    selectedTag,
    searchQuery,
    normalizedSearchQuery,
    currentUserId,
    currentUserProfile,
    filterTabs,
    trendingTags,
    communityUsers,
    posts,
    isLoading,
    isSubmitting,
    isSearchingDestinations,
    feedbackMessage,
    feedbackType,
    destinationResults,
    filteredPosts,
    showCreatePostModal,
    loadCommunity,
    loadPosts,
    loadCurrentUserProfile,
    searchDestinations,
    toggleLike,
    toggleBookmark,
    addPost,
    sharePost,
    addComment,
    deletePost,
    updatePostVisibility,
    updatePost,
    setActiveFilter,
    setSelectedTag,
    setSearchQuery,
    showFeedback,
    showError,
  }
})
