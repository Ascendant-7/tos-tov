import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export interface Comment {
  id: string
  userName: string
  userInitials: string
  text: string
}

export interface Post {
  id: string
  userId: string
  userName: string
  userInitials: string
  location: string
  timeAgo: string
  image: string
  images: string[]
  title: string
  description: string
  likes: number
  comments: Comment[]
  hashtags: string[]
  liked: boolean
  bookmarked: boolean
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
  title?: string | null
  content?: string | null
  created_at?: string | null
  profiles?: ProfileRow | ProfileRow[] | null
  destinations?: DestinationRow | DestinationRow[] | null
  post_media?: MediaRow[] | null
  post_comments?: CommentRow[] | null
  post_likes?: { user_id?: string | null }[] | null
  saved_posts?: { user_id?: string | null }[] | null
  liked_by_viewer?: boolean
  saved_by_viewer?: boolean
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
  visibility?: 'public' | 'friends' | 'private'
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop'

const MOCK_COMMUNITY_USERS: CommunityUser[] = [
  { id: '1', name: 'Sophia L', initials: 'SL', hasStory: true },
  { id: '2', name: 'Marcus C', initials: 'MC', hasStory: false },
  { id: '3', name: 'Aiko Y', initials: 'AY', hasStory: false },
  { id: '4', name: 'Dara K', initials: 'DK', hasStory: true },
  { id: '5', name: 'Elena R', initials: 'ER', hasStory: false },
]

const api = axios.create({
  baseURL: API_BASE_URL,
})

let messageTimer: ReturnType<typeof window.setTimeout> | null = null

const authHeaders = () => {
  const token = localStorage.getItem('access_token')

  return token ? { Authorization: `Bearer ${token}` } : undefined
}

const requireAuthHeaders = () => {
  const headers = authHeaders()

  if (!headers) {
    throw new Error('Please log in to use this feature.')
  }

  return headers
}

const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null') as { id?: string } | null

    return user?.id ?? ''
  } catch {
    return ''
  }
}

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
  const userName = displayNameFor(profile)
  const content = row.content ?? ''
  const images =
    row.post_media
      ?.filter((media) => media.media_type === 'image' && media.public_url)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((media) => media.public_url as string) ?? []

  const location = [destination?.name, destination?.province].filter(Boolean).join(', ') || 'Cambodia'

  return {
    id: row.id,
    userId: row.user_id ?? '',
    userName,
    userInitials: initialsFor(userName),
    location,
    timeAgo: timeAgo(row.created_at),
    image: images[0] ?? destination?.cover_image_url ?? FALLBACK_IMAGE,
    images: images.length > 0 ? images : [destination?.cover_image_url ?? FALLBACK_IMAGE],
    title: row.title?.trim() ?? '',
    description: content,
    likes: row.post_likes?.length ?? 0,
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
    hashtags: extractHashtags(content),
    liked: row.liked_by_viewer ?? false,
    bookmarked: row.saved_by_viewer ?? false,
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

export const useCommunityStore = defineStore('community', () => {
  const activeFilter = ref('All')
  const selectedTag = ref<string | null>(null)
  const currentUserId = ref(getCurrentUserId())
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const isSearchingDestinations = ref(false)
  const feedbackMessage = ref('')
  const feedbackType = ref<FeedbackType>('info')

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
  const communityUsers = ref<CommunityUser[]>(MOCK_COMMUNITY_USERS)
  const posts = ref<Post[]>([])
  const destinationResults = ref<DestinationOption[]>([])

  const filteredPosts = computed(() => {
    let result = posts.value

    if (selectedTag.value) {
      result = result.filter((post) => post.hashtags.includes(selectedTag.value as string))
    }

    return result
  })

  const apiFilter = () => activeFilter.value.toLowerCase()

  const loadPosts = async () => {
    currentUserId.value = getCurrentUserId()
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

  const loadCommunity = async () => {
    await Promise.all([loadPosts(), loadTrendingTags()])
  }

  const setActiveFilter = (filter: string) => {
    activeFilter.value = filter
    void loadPosts()
  }

  const setSelectedTag = (tag: string | null) => {
    selectedTag.value = selectedTag.value === tag ? null : tag
  }

  const searchDestinations = async (query: string) => {
    const trimmedQuery = query.trim()

    if (trimmedQuery.length < 2) {
      destinationResults.value = []
      return
    }

    isSearchingDestinations.value = true

    try {
      const response = await api.get<DestinationRow[]>('/community/destinations/search', {
        params: { q: trimmedQuery },
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

    const wasLiked = post.liked
    post.liked = !wasLiked
    post.likes += wasLiked ? -1 : 1
    clearMessages()

    try {
      if (wasLiked) {
        await api.delete(`/community/posts/${postId}/like`, { headers: requireAuthHeaders() })
      } else {
        await api.post(`/community/posts/${postId}/like`, undefined, { headers: requireAuthHeaders() })
      }
    } catch (error) {
      post.liked = wasLiked
      post.likes += wasLiked ? 1 : -1
      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Please log in to like posts.'
          : 'Please log in to like posts.',
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
        await api.post(`/community/posts/${postId}/save`, undefined, { headers: requireAuthHeaders() })
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
        },
        { headers: requireAuthHeaders() },
      )

      if (files.length > 0) {
        await uploadPostFiles(response.data.id, files)
      }

      await loadPosts()
      void loadTrendingTags()
      showFeedback(files.length > 0 ? 'Post created with photos.' : 'Post created.', 'success')

      return posts.value.find((post) => post.id === response.data.id) ?? mapPost(response.data)
    } catch (error) {
      showError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Post was created only if the request reached the server. Please try again.'
          : 'Please log in to create posts.',
      )

      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const addComment = async (postId: string, text: string) => {
    try {
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
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Please log in to comment.'
          : 'Please log in to comment.',
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

  return {
    activeFilter,
    selectedTag,
    currentUserId,
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
    loadCommunity,
    loadPosts,
    searchDestinations,
    toggleLike,
    toggleBookmark,
    addPost,
    addComment,
    deletePost,
    setActiveFilter,
    setSelectedTag,
  }
})
