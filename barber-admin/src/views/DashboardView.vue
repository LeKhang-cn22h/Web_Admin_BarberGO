<!-- src/views/DashboardView.vue -->
<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">Chào mừng trở lại, {{ userName }}! 👋</h1>
          <p class="text-blue-100">Đây là những gì đang xảy ra với tiệm cắt tóc của bạn hôm nay.</p>
        </div>
        <CalendarDaysIcon class="w-20 h-20 opacity-20" />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="card hover:shadow-lg transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">{{ stat.label }}</p>
            <p class="text-3xl font-bold" :class="stat.color">{{ stat.value }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stat.change }}</p>
          </div>
          <div :class="`bg-${stat.iconBg}-100 p-4 rounded-full`">
            <component :is="stat.icon" :class="`w-8 h-8 text-${stat.iconBg}-600`" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Pending Appointments -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-800">Cuộc hẹn chờ xử lý</h3>
          <router-link to="/appointments" class="text-orange-600 text-sm hover:text-orange-700">
            Xem tất cả →
          </router-link>
        </div>

        <div v-if="loadingAppointments" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="appointment in pendingAppointments"
            :key="appointment.id"
            class="p-4 border border-orange-200 bg-orange-50 rounded-lg"
          >
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="font-medium text-gray-800">{{ appointment.users?.full_name }}</p>
                <p class="text-sm text-gray-600">{{ appointment.name_barber }}</p>
              </div>
              <ClockIcon class="w-5 h-5 text-orange-600" />
            </div>
            <div class="flex gap-2 mt-3">
              <button
                @click="handleConfirm(appointment)"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition"
              >
                Xác nhận
              </button>
              <button
                @click="handleReject(appointment)"
                class="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition"
              >
                Từ chối
              </button>
            </div>
          </div>

          <div v-if="pendingAppointments.length === 0" class="text-center py-8 text-gray-500">
            Chưa có cuộc hẹn chờ xử lý
          </div>
        </div>
      </div>
    </div>

    <!-- Top Barbers -->
    <div class="card">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Thợ cắt tóc hàng đầu</h3>

      <div v-if="loadingBarbers" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="barber in topBarbers"
          :key="barber.id"
          class="p-6 border border-gray-200 rounded-lg hover:shadow-md transition"
        >
          <div class="flex items-center gap-4 mb-4">
            <img
              v-if="barber.imagepath"
              :src="barber.imagepath"
              :alt="barber.name"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div v-else class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon class="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h4 class="font-bold text-gray-800">{{ barber.name }}</h4>
              <div class="flex items-center gap-1 mt-1">
                <StarIcon class="w-4 h-4 text-yellow-500" />
                <span class="text-sm text-gray-600">{{ barber.rank || 0 }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Trạng thái:</span>
            <span :class="barber.status ? 'text-green-600' : 'text-red-600'">
              {{ barber.status ? 'Hoạt động' : 'Không hoạt động' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import appointmentService from '@/api/services/appointmentService'
import barberService from '@/api/services/barberService'
import apiClient from '@/api/axios'
import {
  CalendarDaysIcon,
  ClockIcon,

  UserIcon,
  StarIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const userName = computed(() => authStore.user?.full_name || 'Admin')

const loadingBookings = ref(false)
const loadingAppointments = ref(false)
const loadingBarbers = ref(false)

const recentBookings = ref([])
const pendingAppointments = ref([])
const topBarbers = ref([])


const fetchRecentBookings = async () => {
  loadingBookings.value = true
  try {
    const response = await apiClient.get('/bookings/', { params: { limit: 5 } })
    recentBookings.value = response.data
    
    // Update stats
    const totalResponse = await apiClient.get('/bookings/stats')
    if (totalResponse.data) {
      stats.value[0].value = totalResponse.data.total || '0'
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
  } finally {
    loadingBookings.value = false
  }
}

const fetchPendingAppointments = async () => {
  loadingAppointments.value = true
  try {
    const response = await appointmentService.getByStatus('pending')
    pendingAppointments.value = response.data.slice(0, 5)
    stats.value[2].value = response.data.length.toString()
  } catch (error) {
    console.error('Error fetching appointments:', error)
  } finally {
    loadingAppointments.value = false
  }
}

const fetchTopBarbers = async () => {
  loadingBarbers.value = true
  try {
    const response = await barberService.getTopBarbers(3)
    topBarbers.value = response.data
  } catch (error) {
    console.error('Error fetching barbers:', error)
  } finally {
    loadingBarbers.value = false
  }
}

const handleConfirm = async (appointment) => {
  if (confirm('Xác nhận cuộc hẹn này?')) {
    try {
      await appointmentService.confirm(
        appointment.id,
        authStore.user.id,
        'Xác nhận từ bảng điều khiển'
      )
      await fetchPendingAppointments()
    } catch (error) {
      alert('Xác nhận cuộc hẹn thất bại')
    }
  }
}

const handleReject = async (appointment) => {
  const reason = prompt('Lý do từ chối:')
  if (reason) {
    try {
      await appointmentService.cancel(appointment.id, reason)
      await fetchPendingAppointments()
    } catch (error) {
      alert('Từ chối cuộc hẹn thất bại')
    }
  }
}

onMounted(async () => {
  await Promise.all([
    fetchRecentBookings(),
    fetchPendingAppointments(),
    fetchTopBarbers()
  ])
})
</script>