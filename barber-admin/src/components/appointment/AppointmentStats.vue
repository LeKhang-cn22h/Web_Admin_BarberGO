<!-- src/components/appointments/AppointmentStats.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    <!-- Total -->
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Tổng số</p>
          <p class="text-2xl font-bold text-gray-800">{{ statistics.total }}</p>
        </div>
        <CalendarIcon class="w-10 h-10 text-blue-500" />
      </div>
    </div>

    <!-- Pending -->
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Chờ xử lý</p>
          <p class="text-2xl font-bold text-orange-600">{{ statistics.pending }}</p>
        </div>
        <ClockIcon class="w-10 h-10 text-orange-500" />
      </div>
    </div>

    <!-- Confirmed -->
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Đã xác nhận</p>
          <p class="text-2xl font-bold text-green-600">{{ statistics.confirmed }}</p>
        </div>
        <CheckCircleIcon class="w-10 h-10 text-green-500" />
      </div>
    </div>

    <!-- Completed -->
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Hoàn thành</p>
          <p class="text-2xl font-bold text-blue-600">{{ statistics.completed }}</p>
        </div>
        <CheckBadgeIcon class="w-10 h-10 text-blue-500" />
      </div>
    </div>

    <!-- Cancelled -->
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Đã hủy</p>
          <p class="text-2xl font-bold text-red-600">{{ statistics.cancelled }}</p>
        </div>
        <XCircleIcon class="w-10 h-10 text-red-500" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  CheckBadgeIcon,
  XCircleIcon 
} from '@heroicons/vue/24/outline'

defineProps({
  statistics: {
    type: Object,
    required: true,
    default: () => ({
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    })
  }
})
</script>