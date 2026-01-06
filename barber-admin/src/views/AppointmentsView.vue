<!-- src/views/AppointmentsView.vue -->
<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Tổng cộng</p>
            <p class="text-2xl font-bold">{{ appointments.length }}</p>
          </div>
          <CalendarIcon class="w-10 h-10 text-blue-500" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Chờ xử lý</p>
            <p class="text-2xl font-bold text-orange-600">{{ pendingCount }}</p>
          </div>
          <ClockIcon class="w-10 h-10 text-orange-500" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Đã xác nhận</p>
            <p class="text-2xl font-bold text-green-600">{{ confirmedCount }}</p>
          </div>
          <CheckCircleIcon class="w-10 h-10 text-green-500" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Đã hủy</p>
            <p class="text-2xl font-bold text-red-600">{{ cancelledCount }}</p>
          </div>
          <XCircleIcon class="w-10 h-10 text-red-500" />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="flex gap-4">
        <button
          v-for="status in statuses"
          :key="status.value"
          @click="filterByStatus(status.value)"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            selectedStatus === status.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ status.label }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Đang tải...</p>
      </div>

      <div v-else>
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thợ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tạo lúc</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="appointment in filteredAppointments" :key="appointment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">{{ appointment.users?.full_name }}</td>
              <td class="px-6 py-4">{{ appointment.name_barber }}</td>
              <td class="px-6 py-4">{{ appointment.phone }}</td>
              <td class="px-6 py-4">{{ appointment.email }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(appointment.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ appointment.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(appointment.created_at) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button
                    v-if="appointment.status === 'pending'"
                    @click="confirmAppointment(appointment)"
                    class="text-green-600 hover:text-green-800"
                  >
                    <CheckIcon class="w-5 h-5" />
                  </button>
                  <button
                    v-if="appointment.status !== 'cancelled'"
                    @click="cancelAppointment(appointment)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppointmentStore } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const appointmentStore = useAppointmentStore()
const authStore = useAuthStore()

const selectedStatus = ref('all')
const isLoading = ref(false)

const statuses = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
]

const appointments = computed(() => appointmentStore.appointments)

const filteredAppointments = computed(() => {
  if (selectedStatus.value === 'all') return appointments.value
  return appointments.value.filter(a => a.status === selectedStatus.value)
})

const pendingCount = computed(() => 
  appointments.value.filter(a => a.status === 'pending').length
)
const confirmedCount = computed(() => 
  appointments.value.filter(a => a.status === 'confirmed').length
)
const cancelledCount = computed(() => 
  appointments.value.filter(a => a.status === 'cancelled').length
)

const filterByStatus = (status) => {
  selectedStatus.value = status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-orange-100 text-orange-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const confirmAppointment = async (appointment) => {
  if (confirm('Xác nhận lịch hẹn này?')) {
    await appointmentStore.confirmAppointment(
      appointment.id,
      authStore.user.id,
      'Đã xác nhận bởi admin'
    )
  }
}

const cancelAppointment = async (appointment) => {
  const reason = prompt('Lý do hủy lịch:')
  if (reason) {
    await appointmentStore.cancelAppointment(appointment.id, reason)
  }
}

onMounted(async () => {
  isLoading.value = true
  await appointmentStore.fetchAll()
  isLoading.value = false
})
</script>