import { createRouter, createWebHistory } from 'vue-router'

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
      meta: { showLayout: false },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../modules/auth/RegisterView.vue'),
      meta: { showLayout: false },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../modules/home/HomePage.vue'),
      meta: { showLayout: true },
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../modules/explore/ExplorePage.vue'),
      meta: { showLayout: true },
    },
    {
      path: '/explore/:id',
      name: 'destination-detail',
      component: () => import('../modules/explore/pages/DestinationDetailPage.vue'),
      meta: { showLayout: true },
    },
    {
      path: '/trip-planner',
      name: 'trip-planner',
      component: () => import('../core/pages/TripPlannerPage.vue'),
      meta: { showLayout: true },
    },
    {
      path: '/route-intel',
      name: 'route-intel',
      component: () => import('../core/pages/RoutesPage.vue'),
      meta: { showLayout: true },
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('../core/pages/SocialPage.vue'),
      meta: { showLayout: true },
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../core/pages/CommunityPage.vue'),
      meta: { showLayout: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../core/pages/ProfilePage.vue'),
      meta: { showLayout: true },
    },
    {
      path: '/trips/:tripId',
      name: 'trip-itinerary',
      component: () => import('../modules/itinerary/pages/ItineraryPage.vue'),
      meta: { showLayout: true },
    },
    {
      path: '/budget',
      name: 'budget',
      component: () => import('../modules/budget/pages/BudgetPage.vue'),
      meta: { showLayout: true },
    },
  ],
})

export default router
