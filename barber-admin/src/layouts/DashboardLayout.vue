<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b bg-gradient-to-r from-blue-600 to-blue-700">
        <ScissorsIcon class="w-8 h-8 text-white" />
        <span class="ml-2 text-xl font-bold text-white">Barber Admin</span>
      </div>
      
      <!-- Navigation -->
      <nav class="p-4 space-y-1 overflow-y-auto" style="height: calc(100vh - 128px);">
        <!-- Main Menu -->
        <div class="mb-4">
          <div class="px-3 mb-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</p>
          </div>
          <router-link
            v-for="item in mainMenuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition"
            :class="isActive(item.path) 
              ? 'bg-blue-50 text-blue-600 font-medium' 
              : 'text-gray-700 hover:bg-gray-50'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </div>

        <!-- RAG Menu -->
        <div class="pt-4 border-t">
          <div class="px-3 mb-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <SparklesIcon class="w-4 h-4" />
              AI Chatbot
            </p>
          </div>
          <router-link
            v-for="item in ragMenuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition"
            :class="isActive(item.path) 
              ? 'bg-purple-50 text-purple-600 font-medium' 
              : 'text-gray-700 hover:bg-gray-50'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </nav>

      <!-- Logout Button -->
      <div class="absolute bottom-0 w-full p-4 border-t bg-white">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition font-medium"
        >
          <ArrowLeftOnRectangleIcon class="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Header -->
      <header class="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-30">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
          <p class="text-xs text-gray-500">{{ currentPath }}</p>
        </div>
        
        <div class="flex items-center gap-4">
    

          <!-- User Menu -->
          <div class="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <span class="text-white text-sm font-bold">{{ userInitials }}</span>
            </div>
            <div class="text-sm">
              <p class="font-medium text-gray-800">{{ userName }}</p>
              <p class="text-xs text-gray-500">{{ userRole }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  CalendarIcon,
  ScissorsIcon,
  UsersIcon,
  DocumentTextIcon,
  BeakerIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const mainMenuItems = [
  { 
    path: '/', 
    label: 'Dashboard', 
    icon: HomeIcon 
  },
  { 
    path: '/appointments', 
    label: 'Appointments', 
    icon: CalendarIcon,
    badge: null // Có thể thêm số pending
  },
  { 
    path: '/barbers', 
    label: 'Barbers', 
    icon: ScissorsIcon 
  },
  { 
    path: '/users', 
    label: 'Users', 
    icon: UsersIcon 
  }
]

const ragMenuItems = [
  { 
    path: '/rag/documents', 
    label: 'Knowledge Base', 
    icon: DocumentTextIcon 
  },

  { 
    path: '/rag/test', 
    label: 'Test Chatbot', 
    icon: BeakerIcon 
  }
]

const pageTitle = computed(() => {
  const allItems = [...mainMenuItems, ...ragMenuItems]
  const currentRoute = allItems.find(item => {
    if (item.path === '/') return route.path === '/'
    return route.path.startsWith(item.path)
  })
  return currentRoute?.label || 'Dashboard'
})

const currentPath = computed(() => {
  return route.path
})

const userName = computed(() => authStore.user?.full_name || 'Admin User')

const userRole = computed(() => {
  const role = authStore.user?.role || 'admin'
  return role.charAt(0).toUpperCase() + role.slice(1)
})

const userInitials = computed(() => {
  const name = authStore.user?.full_name || 'Admin'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    await authStore.logout()
    router.push('/login')
  }
}
</script>