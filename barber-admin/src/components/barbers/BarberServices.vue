<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Dịch vụ</h2>
      
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="services.length === 0" class="text-center py-12">
      <ScissorsIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-800 mb-2">Chưa có dịch vụ</h3>
    </div>

    <!-- Services List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="service in services"
        :key="service.id"
        class="border rounded-lg p-4 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800 mb-1">{{ service.service_name }}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">{{ service.description }}</p>
          </div>
          <span
            :class="service.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            class="px-2 py-1 text-xs font-medium rounded"
          >
            {{ service.status ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 text-sm">
            <span class="font-bold text-blue-600">{{ formatPrice(service.price) }}</span>
            <span class="text-gray-500">{{ service.duration_min }} phút</span>
          </div>

          <div class="flex items-center gap-2">
           
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ScissorsIcon} from '@heroicons/vue/24/outline'

defineProps({
  services: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['add', 'edit', 'toggle-status'])

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}
</script>