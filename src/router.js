import { createRouter, createWebHashHistory } from 'vue-router';

import AppLayout from './layout/AppLayout.vue';
import EmptyLayout from './layout/EmptyLayout.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('./pages/Home.vue'),
        },
      ],
    },

    {
      path: '/user',
      component: EmptyLayout,
      children: [
        {
          path: 'signin',
          component: () => import('./pages/user/SignIn.vue'),
        },
        {
          path: 'signup',
          component: () => import('./pages/user/SignUp.vue'),
        },
      ],
    },

    {
      path: '/:catchAll(.*)*',
      component: () => import('./pages/NotFoundPage.vue'),
    },
  ],

  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
});

export default router;
