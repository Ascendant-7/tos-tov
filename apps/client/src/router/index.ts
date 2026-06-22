import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../services/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../modules/auth/LoginView.vue'),
      meta: { showLayout: false, requiresAuth: false },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../modules/auth/RegisterView.vue'),
      meta: { showLayout: false, requiresAuth: false },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../modules/auth/ForgotPasswordView.vue'),
      meta: { showLayout: false, requiresAuth: false },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../modules/home/HomePage.vue'),
      meta: { showLayout: true, requiresAuth: false },
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../modules/explore/ExplorePage.vue'),
      meta: { showLayout: true, requiresAuth: false },
    },
    {
      path: '/explore/:id',
      name: 'destination-detail',
      component: () => import('../modules/explore/pages/DestinationDetailPage.vue'),
      meta: { showLayout: true, requiresAuth: false },
    },
    {
      path: '/trip-planner',
      name: 'trip-planner',
      redirect: { path: '/trips', query: { tab: 'planner' } },
      meta: { requiresAuth: true },
    },
    {
      path: '/trips',
      name: 'my-trips',
      component: () => import('../modules/itinerary/pages/MyTripsPage.vue'),
      meta: { showLayout: true, requiresAuth: true },
    },
    {
      path: '/shared-trips',
      name: 'shared-trips',
      redirect: { path: '/trips', query: { tab: 'shared' } },
      meta: { requiresAuth: true },
    },
    {
      path: '/route-intel',
      name: 'route-intel',
      component: () => import('../core/pages/RoutesPage.vue'),
      meta: { showLayout: true, requiresAuth: true },
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('../core/pages/SocialPage.vue'),
      meta: { showLayout: true, requiresAuth: true },
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../core/pages/CommunityPage.vue'),
      meta: { showLayout: true, requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../modules/user/ProfileView.vue'),
      meta: { showLayout: true, requiresAuth: true },
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('../modules/user/EditProfileView.vue'),
      meta: { showLayout: true, requiresAuth: true },
    },
    {
      path: '/trips/:tripId',
      name: 'trip-itinerary',
      component: () => import('../modules/itinerary/pages/ItineraryPage.vue'),
      meta: { showLayout: true, requiresAuth: true },
    },
    {
      path: '/budget',
      name: 'budget',
      component: () => import('../modules/budget/pages/BudgetPage.vue'),
      meta: { showLayout: true, requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    return { name: 'login' }
  }

  const forceAuthPage = to.query.force === '1' || to.query.force === 'true'

  if (session && !forceAuthPage && (to.name === 'login' || to.name === 'signup')) {
    return { name: 'home' }
  }
})

export default router
