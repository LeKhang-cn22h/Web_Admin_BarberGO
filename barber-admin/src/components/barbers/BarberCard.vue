<!-- src/components/barbers/BarberCard.vue -->
<template>
  <div
    class="card hover:shadow-xl transition group cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Image -->
    <div class="relative mb-4">
      <img
        v-if="barber.imagepath"
        :src="barber.imagepath"
        :alt="barber.name"
        class="w-full h-48 object-cover rounded-lg"
      />
      <div v-else class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
        <UserIcon class="w-20 h-20 text-gray-400" />
      </div>

      <!-- Status Badge -->
      <div class="absolute top-3 right-3">
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            barber.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          ]"
        >
          {{ barber.status ? 'Hoạt động' : 'Không hoạt động' }}
        </span>
      </div>
    </div>

    <!-- Info -->
    <div>
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
          {{ barber.name }}
        </h3>
        <div class="flex items-center gap-1">
          <StarIcon class="w-4 h-4 text-yellow-500 fill-current" />
          <span class="text-sm font-medium">{{ barber.rank || 0 }}</span>
        </div>
      </div>

      <div class="space-y-2 text-sm text-gray-600">
        <div v-if="barber.address" class="flex items-start gap-2">
          <MapPinIcon class="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span class="line-clamp-2">{{ barber.address }}</span>
        </div>

        <div v-if="barber.area" class="flex items-center gap-2">
          <BuildingStorefrontIcon class="w-4 h-4" />
          <span>{{ barber.area }}</span>
        </div>

        <div v-if="barber.opening_time && barber.closing_time" class="flex items-center gap-2">
          <ClockIcon class="w-4 h-4" />
          <span>{{ barber.opening_time }} - {{ barber.closing_time }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 mt-4 pt-4 border-t">
        <button
          @click.stop="$emit('edit')"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
        >
          Chỉnh sửa
        </button>
        <button
          @click.stop="$emit('toggle-status')"
          class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 rounded-lg transition"
        >
          {{ barber.status ? 'Vô hiệu hóa' : 'Kích hoạt' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UserIcon,
  StarIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

defineProps({
  barber: {
    type: Object,
    required: true
  }
})

defineEmits(['click', 'edit', 'toggle-status'])
</script>