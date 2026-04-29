import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../modules/home/HomePage.vue'),
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../modules/explore/ExplorePage.vue'),
    },
    {
      path: '/trip-planner',
      name: 'trip-planner',
      component: () => import('../core/pages/TripPlannerPage.vue'),
    },
    {
      path: '/route-intel',
      name: 'route-intel',
      component: () => import('../core/pages/RoutesPage.vue'),
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('../core/pages/SocialPage.vue'),
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../core/pages/CommunityPage.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../core/pages/ProfilePage.vue'),
    },
    {
      path: '/itinerary',
      name: 'itinerary',
      component: () => import('../modules/itinerary/pages/ItineraryPage.vue'),
    }
  ],
})

export default router
