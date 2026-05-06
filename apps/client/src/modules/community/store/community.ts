import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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

// --- Mock Data ---
const MOCK_COMMUNITY_USERS: CommunityUser[] = [
  { id: '1', name: 'Sophia L', initials: 'SL', hasStory: true },
  { id: '2', name: 'Marcus C', initials: 'MC', hasStory: false },
  { id: '3', name: 'Aiko Y', initials: 'AY', hasStory: false },
  { id: '4', name: 'Dara K', initials: 'DK', hasStory: true },
  { id: '5', name: 'Elena R', initials: 'ER', hasStory: false },
]

const MOCK_COMMUNITY_POSTS: Post[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Tom Watts',
    userInitials: 'TW',
    location: 'Battambang',
    timeAgo: '2h ago',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop'],
    title: 'The bamboo train in Battambang is a must-do.',
    description:
      "The bamboo train in Battambang is a must-do. Yes, it's a flat bamboo platform on wheels — and yes it is absolutely terrifying and awesome.",
    likes: 2214,
    comments: [
      {
        id: '1',
        userName: 'Sarah M',
        userInitials: 'SM',
        text: 'This looks amazing! Adding to my bucket list!',
      },
      {
        id: '2',
        userName: 'James P',
        userInitials: 'JP',
        text: 'I did this last year, best decision ever 🚂',
      },
    ],
    hashtags: ['#Battambang', '#BambooTrain', '#OnlyCambodia', '#Adventure'],
    liked: false,
    bookmarked: false,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sophia Lim',
    userInitials: 'SL',
    location: 'Angkor Wat, Siem Reap',
    timeAgo: '2h ago',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop'],
    title: 'Sunrise at Angkor Wat',
    description:
      'Nothing beats waking up before dawn to catch the magical sunrise over Angkor Wat. The colors, the energy, the history—all converging into one unforgettable moment.',
    likes: 3456,
    comments: [
      {
        id: '1',
        userName: 'David Lee',
        userInitials: 'DL',
        text: 'Worth the early wake up call 💯',
      },
    ],
    hashtags: ['#AngkorWat', '#SiemReap', '#Cambodia', '#SunriseAdventure'],
    liked: false,
    bookmarked: false,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Marcus Chen',
    userInitials: 'MC',
    location: 'Koh Rong',
    timeAgo: '4h ago',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=500&fit=crop',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=500&fit=crop'],
    title: 'Paradise islands await',
    description:
      "Spent the last 3 days island hopping around Koh Rong. Crystal clear waters, white sand beaches, and the most incredible seafood I've ever tasted.",
    likes: 1890,
    comments: [
      { id: '1', userName: 'Lisa Wong', userInitials: 'LW', text: 'Looking at flights now!' },
    ],
    hashtags: ['#KohRong', '#IslandLife', '#Cambodia', '#BeachVibes'],
    liked: false,
    bookmarked: false,
  },
]

export const useCommunityStore = defineStore('community', () => {
  // --- Filter State ---
  const activeFilter = ref('All')
  const selectedTag = ref<string | null>(null)
  const isLoading = ref(false)

  const filterTabs = ['All', 'Following', 'Popular', 'Saved']

  const trendingTags = [
    '#AngkorWat',
    '#KohRong',
    '#Kampot',
    '#PhomPenh',
    '#HiddenGems',
    '#CambodiaTravelTips',
  ]

  // --- Community Users ---
  const communityUsers = ref<CommunityUser[]>(MOCK_COMMUNITY_USERS)

  // --- Posts ---
  const posts = ref<Post[]>(MOCK_COMMUNITY_POSTS)

  // --- Computed ---
  const filteredPosts = computed(() => {
    let result = posts.value

    // Filter by tab
    if (activeFilter.value === 'Following') {
      result = result.slice(0, 2)
    } else if (activeFilter.value === 'Popular') {
      result = result.sort((a, b) => b.likes - a.likes)
    } else if (activeFilter.value === 'Saved') {
      result = result.filter((p) => p.bookmarked)
    }

    // Filter by selected tag
    if (selectedTag.value) {
      result = result.filter((p) => p.hashtags.some((tag) => tag === selectedTag.value))
    }

    return result
  })

  // --- Actions ---
  const toggleLike = (postId: string) => {
    const post = posts.value.find((p) => p.id === postId)
    if (post) {
      post.liked = !post.liked
      post.likes += post.liked ? 1 : -1
    }
  }

  const toggleBookmark = (postId: string) => {
    const post = posts.value.find((p) => p.id === postId)
    if (post) {
      post.bookmarked = !post.bookmarked
    }
  }

  const addPost = (text: string, hashtags: string[], images?: string[]): Post => {
    const imageList =
      images && images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop']
    const newPost: Post = {
      id: Date.now().toString(),
      userId: 'currentUser',
      userName: 'You',
      userInitials: 'YO',
      location: 'Cambodia',
      timeAgo: 'now',
      image: imageList[0]!,
      images: imageList,
      title: text.substring(0, 50),
      description: text,
      likes: 0,
      comments: [],
      hashtags: hashtags.length > 0 ? hashtags : ['#Cambodia'],
      liked: false,
      bookmarked: false,
    }

    posts.value.unshift(newPost)
    return newPost
  }

  const addComment = (postId: string, text: string) => {
    const post = posts.value.find((p) => p.id === postId)
    if (post) {
      post.comments.push({
        id: Date.now().toString(),
        userName: 'You',
        userInitials: 'YO',
        text,
      })
    }
  }

  const setActiveFilter = (filter: string) => {
    activeFilter.value = filter
  }

  const setSelectedTag = (tag: string | null) => {
    selectedTag.value = selectedTag.value === tag ? null : tag
  }

  return {
    // State
    activeFilter,
    selectedTag,
    filterTabs,
    trendingTags,
    communityUsers,
    posts,

    // Computed
    filteredPosts,

    // Actions
    toggleLike,
    toggleBookmark,
    addPost,
    addComment,
    setActiveFilter,
    setSelectedTag,
  }
})
