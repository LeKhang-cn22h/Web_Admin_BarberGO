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

        // ===== RAG =====
        {
          path: 'rag/documents',
          name: 'rag-documents',
          component: () => import('@/views/RAG/DocumentsView.vue')
        },
        {
          path: 'rag/chat-sessions',
          name: 'rag-chat-sessions',
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

/* =====================
   NAVIGATION GUARD
===================== */

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)

  // 1. Nếu trang cần Auth mà không có token -> Về Login
  if (authRequired && !authStore.token) {
    return next('/login')
  }

  // 2. Nếu có Token nhưng chưa có thông tin User (trường hợp F5 refresh trang)
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser() // Gọi API lấy thông tin user từ token hiện có
    } catch (error) {
      // Nếu token không hợp lệ -> Logout
      await authStore.logout()
      return next('/login')
    }
  }

  // 3. Nếu đã đăng nhập mà cố vào trang Login -> Đẩy về Home
  if (to.path === '/login' && authStore.isAuthenticated) {
    return next('/')
  }

  next()
})
export default router
