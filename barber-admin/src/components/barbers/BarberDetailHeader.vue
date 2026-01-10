<template>
  <div class="card">
    <div class="flex items-start gap-6">
      <!-- Avatar/Image -->
      <div class="flex-shrink-0">
        <div v-if="barber.imagepath" class="w-32 h-32 rounded-lg overflow-hidden">
          <img :src="barber.imagepath" :alt="barber.name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <ScissorsIcon class="w-16 h-16 text-white" />
        </div>
      </div>

      <!-- Info -->
      <div class="flex-1">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ barber.name }}</h1>
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <StarIcon class="w-5 h-5 text-yellow-400" />
                <span class="font-medium">{{ barber.rank || 0 }} / 5.0</span>
              </div>
              <div class="flex items-center gap-1">
                <span :class="barber.status ? 'text-green-600' : 'text-red-600'" class="font-medium">
                  {{ barber.status ? '🟢 Đang hoạt động' : '🔴 Ngừng hoạt động' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div v-if="barber.address">
            <p class="text-gray-500 mb-1">Địa chỉ</p>
            <p class="text-gray-800 font-medium">{{ barber.address }}</p>
          </div>
          <div v-if="barber.area">
            <p class="text-gray-500 mb-1">Khu vực</p>
            <p class="text-gray-800 font-medium">{{ barber.area }}</p>
          </div>
          <div v-if="barber.lat && barber.lng">
            <p class="text-gray-500 mb-1">Tọa độ</p>
            <p class="text-gray-800 font-medium">{{ barber.lat }}, {{ barber.lng }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ScissorsIcon, StarIcon} from '@heroicons/vue/24/outline'

defineProps({
  barber: {
    type: Object,
    required: true
  }
})

defineEmits(['edit'])
</script>