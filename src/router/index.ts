import Home from '@/views/Home.vue'
import NodeView from '@/views/NodeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../views/UploadView.vue'),
    },
    {
      path: '/p/:id',
      name: 'published',
      component: () => NodeView,
    },
    {
      path: '/video/:id',
      name: 'video',
      component: () => import('../views/VideoView.vue'),
    },
  ],
})

export default router
