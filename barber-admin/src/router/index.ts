// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: 'appointments',
          name: 'appointments',
          component: () => import('@/views/AppointmentsView.vue')
        },
        {
          path: 'barbers',
          name: 'barbers',
          component: () => import('@/views/BarbersView.vue')
        },
        {
          path: 'barbers/:id',
          name: 'barber-detail',
          component: () => import('@/views/BarberDetailView.vue')
        },
      
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/UsersView.vue')
        },
        // ✅ RAG Routes
        {
          path: 'rag/documents',
          name: 'rag-documents',
          component: () => import('@/views/RAG/DocumentsView.vue')
        },
        {
          path: 'rag/chat-sessions',
          name: 'chat-sessions',
          component: () => import('@/views/RAG/ChatSessionsView.vue')
        },
        {
          path: 'rag/test',
          name: 'rag-test',
          component: () => import('@/views/RAG/TestChatView.vue')
        }
      ]
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router