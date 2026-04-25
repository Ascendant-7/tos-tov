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
      component: () => import('../pages/HomePage.vue'),
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../pages/ExplorePage.vue'),
    },
    {
      path: '/trip-planner',
      name: 'trip-planner',
      component: () => import('../pages/TripPlannerPage.vue'),
    },
    {
      path: '/route-intel',
      name: 'route-intel',
      component: () => import('../pages/RoutesPage.vue'),
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('../pages/SocialPage.vue'),
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../pages/CommunityPage.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../pages/ProfilePage.vue'),
    },
  ],
})

export default router
