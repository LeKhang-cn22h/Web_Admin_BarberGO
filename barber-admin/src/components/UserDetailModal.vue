<!-- src/components/UserDetailModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-800">Hồ sơ người dùng</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- User Header -->
        <div class="flex items-start gap-6">
          <div class="relative">
            <img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              :alt="user.full_name"
              class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div v-else class="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span class="text-white text-2xl font-bold">{{ getInitials(user.full_name) }}</span>
            </div>
            <div :class="[
              'absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white',
              user.status ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
          </div>

          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-800 mb-1">{{ user.full_name || 'Không có' }}</h2>
            <p class="text-gray-600 mb-3">{{ user.email }}</p>
            <div class="flex gap-2">
              <span :class="getRoleBadge(user.role)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ user.role || 'user' }}
              </span>
              <span :class="user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ user.status ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Contact Information -->
          <div class="card bg-blue-50 border border-blue-200">
            <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PhoneIcon class="w-5 h-5 text-blue-600" />
              Thông tin liên lạc
            </h4>
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-gray-600">Email</p>
                <p class="font-medium text-gray-800">{{ user.email }}</p>
              </div>
              <div>
                <p class="text-gray-600">Số điện thoại</p>
                <p class="font-medium text-gray-800">{{ user.phone || 'Không có' }}</p>
              </div>
              <div>
                <p class="text-gray-600">Token FCM</p>
                <p class="font-medium text-gray-800 truncate" :title="user.fcm_token">
                  {{ user.fcm_token ? user.fcm_token.substring(0, 20) + '...' : 'Chưa đặt' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Account Information -->
          <div class="card bg-green-50 border border-green-200">
            <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UserCircleIcon class="w-5 h-5 text-green-600" />
              Thông tin tài khoản
            </h4>
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-gray-600">ID người dùng</p>
                <p class="font-medium text-gray-800 font-mono text-xs">{{ user.id }}</p>
              </div>
              <div>
                <p class="text-gray-600">Vai trò</p>
                <p class="font-medium text-gray-800 capitalize">{{ user.role || 'user' }}</p>
              </div>
              <div>
                <p class="text-gray-600">Trạng thái</p>
                <p :class="user.status ? 'text-green-600' : 'text-red-600'" class="font-medium">
                  {{ user.status ? 'Hoạt động' : 'Không hoạt động' }}
                </p>
              </div>
              <div>
                <p class="text-gray-600">Tham gia</p>
                <p class="font-medium text-gray-800">{{ formatDateTime(user.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Stats -->
        <div class="card">
          <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ChartBarIcon class="w-5 h-5 text-purple-600" />
            Tổng quan hoạt động
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-3xl font-bold text-blue-600">{{ userStats.totalBookings }}</p>
              <p class="text-sm text-gray-600 mt-1">Tổng lịch hẹn</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-3xl font-bold text-green-600">{{ userStats.completedBookings }}</p>
              <p class="text-sm text-gray-600 mt-1">Đã hoàn thành</p>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <p class="text-3xl font-bold text-orange-600">{{ userStats.pendingBookings }}</p>
              <p class="text-sm text-gray-600 mt-1">Chờ xử lý</p>
            </div>
           
          </div>
        </div>        

        <!-- Recent Appointments -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardDocumentListIcon class="w-5 h-5 text-orange-600" />
              Các cuộc hẹn gần đây
            </h4>
          </div>

          <div v-if="loadingAppointments" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          </div>

          <div v-else-if="recentAppointments.length === 0" class="text-center py-8 text-gray-500">
            Chưa có cuộc hẹn
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="appointment in recentAppointments"
              :key="appointment.id"
              class="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-800">{{ appointment.name_barber }}</p>
                <p class="text-sm text-gray-600">{{ appointment.phone }}</p>
              </div>
              <span :class="getAppointmentStatusBadge(appointment.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ appointment.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t">
          <button
            v-if="user.role === 'user'"
            @click="changeRole('admin')"
            class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <ShieldCheckIcon class="w-5 h-5" />
            Thành Admin
          </button>
          <button
            v-if="user.role === 'admin'"
            @click="changeRole('user')"
            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <UserIcon class="w-5 h-5" />
            Gỡ quyền Admin
          </button>
          <button
            @click="toggleStatus"
            :class="user.status ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
            class="flex-1 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <component :is="user.status ? LockClosedIcon : LockOpenIcon" class="w-5 h-5" />
            {{ user.status ? 'Vô hiệu hóa' : 'Kích hoạt' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/api/axios'
import {
  XMarkIcon,
  PhoneIcon,
  UserCircleIcon,
  ChartBarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const loadingBookings = ref(false)
const loadingAppointments = ref(false)
const recentBookings = ref([])
const recentAppointments = ref([])

const userStats = computed(() => {
  return {
    totalBookings: recentBookings.value.length,
    completedBookings: recentBookings.value.filter(b => b.status === 'completed').length,
    pendingBookings: recentBookings.value.filter(b => b.status === 'confirmed').length,
    totalSpent: recentBookings.value
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.total_price, 0)
  }
})

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const getRoleBadge = (role) => {
  const badges = {
    admin: 'bg-purple-100 text-purple-800',
    staff: 'bg-blue-100 text-blue-800',
    user: 'bg-gray-100 text-gray-800'
  }
  return badges[role] || badges.user
}

const getStatusBadge = (status) => {
  const badges = {
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return badges[status] || 'bg-gray-100 text-gray-800'
}

const getAppointmentStatusBadge = (status) => {
  const badges = {
    pending: 'bg-orange-100 text-orange-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return badges[status] || 'bg-gray-100 text-gray-800'
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTimeRange = (timeSlot) => {
  if (!timeSlot) return 'N/A'
  const start = timeSlot.start_time?.substring(0, 5) || ''
  const end = timeSlot.end_time?.substring(0, 5) || ''
  return `${start} - ${end}`
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const fetchUserBookings = async () => {
  loadingBookings.value = true
  try {
    const response = await apiClient.get(`/bookings/user/${props.user.id}`)
    recentBookings.value = response.data.slice(0, 5)
  } catch (error) {
    console.error('Error fetching bookings:', error)
  } finally {
    loadingBookings.value = false
  }
}

const fetchUserAppointments = async () => {
  loadingAppointments.value = true
  try {
    const response = await apiClient.get(`/appointments/user/${props.user.id}`)
    recentAppointments.value = response.data.slice(0, 5)
  } catch (error) {
    console.error('Error fetching appointments:', error)
  } finally {
    loadingAppointments.value = false
  }
}

const changeRole = async (newRole) => {
  if (!confirm(`Thay đổi vai trò người dùng thành ${newRole}?`)) return

  try {
    await apiClient.patch(`/users/${props.user.id}`, { role: newRole })
    emit('updated')
    emit('close')
  } catch (error) {
    console.error('Error changing user role:', error)
    alert('Không thể cập nhật vai trò người dùng')
  }
}

const toggleStatus = async () => {
  const action = props.user.status ? 'deactivate' : 'activate'
  if (!confirm(`Bạn có chắc muốn ${action} người dùng này không?`)) return

  try {
    await apiClient.patch(`/users/${props.user.id}`, { status: !props.user.status })
    emit('updated')
    emit('close')
  } catch (error) {
    console.error('Error toggling user status:', error)
    alert('Không thể cập nhật trạng thái người dùng')
  }
}

onMounted(() => {
  fetchUserBookings()
  fetchUserAppointments()
})
</script>