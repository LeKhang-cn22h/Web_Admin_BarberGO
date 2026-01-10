<!-- src/views/UsersView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <p class="text-gray-600 mt-1">Quản lý tài khoản và quyền của khách</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Tổng người dùng</p>
            <p class="text-2xl font-bold text-blue-600">{{ users.length }}</p>
          </div>
          <UsersIcon class="w-10 h-10 text-blue-500" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Hoạt động</p>
            <p class="text-2xl font-bold text-green-600">{{ activeUsers }}</p>
          </div>
          <CheckCircleIcon class="w-10 h-10 text-green-500" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Admin</p>
            <p class="text-2xl font-bold text-purple-600">{{ adminUsers }}</p>
          </div>
          <ShieldCheckIcon class="w-10 h-10 text-purple-500" />
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Chủ sở hữu</p>
            <p class="text-2xl font-bold text-orange-600">{{ ownerUsers }}</p>
          </div>
          <UserPlusIcon class="w-10 h-10 text-orange-500" />
        </div>
    </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            class="input-field pl-10"
          />
        </div>

        <select v-model="filterRole" class="input-field">
          <option value="all">Tất cả vai trò</option>
          <option value="user">Người dùng</option>
          <option value="admin">Admin</option>
          <option value="owner">Chủ sở hữu</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Đang tải người dùng...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên lạc</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tham gia</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">XEM</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="user.avatar_url"
                    :src="user.avatar_url"
                    :alt="user.full_name"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div v-else class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-medium">{{ getInitials(user.full_name) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ user.full_name || 'Không có' }}</p>
                    <p class="text-sm text-gray-600">ID: {{ user.id.substring(0, 8) }}...</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm">
                  <p class="text-gray-800">{{ user.email }}</p>
                  <p class="text-gray-600">{{ user.phone || 'Không có' }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="getRoleBadge(user.role)" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ user.role || 'user' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ user.status ? 'Hoạt động' : 'Không hoạt động' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4">
                  <button
                    @click="viewUser(user)"
                    class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                    title="Xem"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t">
        <div class="text-sm text-gray-600">
          Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} đến {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} của {{ filteredUsers.length }} người dùng
        </div>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1 border rounded',
              currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp
          </button>
        </div>
      </div>
    </div>

    <!-- User Detail Modal -->
    <UserDetailModal
      v-if="selectedUser"
      :user="selectedUser"
      @close="selectedUser = null"
      @updated="fetchUsers"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/api/axios'
import UserDetailModal from '@/components/UserDetailModal.vue'
import {
  UsersIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/vue/24/outline'

const isLoading = ref(false)
const users = ref([])
const searchQuery = ref('')
const filterRole = ref('all')
const selectedUser = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

const activeUsers = computed(() => users.value.filter(u => u.status).length)
const adminUsers = computed(() => users.value.filter(u => u.role === 'admin').length)
const ownerUsers = computed(() => users.value.filter(u => u.role === 'owner').length)


const filteredUsers = computed(() => {
  let result = users.value

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(u =>
      u.full_name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.includes(query)
    )
  }

  // Filter by role
  if (filterRole.value !== 'all') {
    result = result.filter(u => u.role === filterRole.value)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const getRoleBadge = (role) => {
  const badges = {
    admin: 'bg-purple-100 text-purple-800',
    staff: 'bg-blue-100 text-blue-800',
    user: 'bg-gray-100 text-gray-800'
  }
  return badges[role] || badges.user
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await apiClient.get('/users/')
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

const viewUser = (user) => {
  selectedUser.value = user
}

const toggleUserStatus = async (user) => {
  const action = user.status ? 'deactivate' : 'activate'
  if (confirm(`Bạn có chắc muốn ${action} người dùng này không?`)) {
    try {
      await apiClient.patch(`/users/${user.id}`, { status: !user.status })
      await fetchUsers()
    } catch (error) {
      print(error)
      alert('Không thể cập nhật trạng thái người dùng')
    }
  }
}

onMounted(() => {
  fetchUsers()
})
</script>