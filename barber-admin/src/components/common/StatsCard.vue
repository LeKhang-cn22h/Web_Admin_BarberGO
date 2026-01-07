<!-- src/components/common/StatsCard.vue -->
<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600">{{ label }}</p>
        <p 
          class="text-2xl font-bold"
          :class="valueColorClass"
        >
          {{ value }}
        </p>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: 'gray'
  }
})

const valueColorClass = computed(() => {
  const colors = {
    orange: 'text-orange-600',
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600'
  }
  return colors[props.color] || 'text-gray-600'
})
</script>