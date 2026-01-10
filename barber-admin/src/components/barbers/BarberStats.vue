<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Total Bookings -->
    <div class="card bg-blue-50 border border-blue-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-blue-600 font-medium">Tổng lượt đặt</p>
          <p class="text-3xl font-bold text-blue-700">{{ statistics.totalBookings }}</p>
        </div>
        <CalendarIcon class="w-12 h-12 text-blue-400" />
      </div>
    </div>

    <!-- Completed -->
    <div class="card bg-green-50 border border-green-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-green-600 font-medium">Đã hoàn thành</p>
          <p class="text-3xl font-bold text-green-700">{{ statistics.completedBookings }}</p>
        </div>
        <CheckCircleIcon class="w-12 h-12 text-green-400" />
      </div>
    </div>

    <!-- Services -->
    <div class="card bg-purple-50 border border-purple-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-purple-600 font-medium">Dịch vụ</p>
          <p class="text-3xl font-bold text-purple-700">{{ statistics.totalServices }}</p>
        </div>
        <ScissorsIcon class="w-12 h-12 text-purple-400" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { CalendarIcon, CheckCircleIcon, ScissorsIcon } from '@heroicons/vue/24/outline'

defineProps({
  statistics: {
    type: Object,
    default: () => ({
      totalBookings: 0,
      completedBookings: 0,
      totalServices: 0
    })
  }
})
</script>