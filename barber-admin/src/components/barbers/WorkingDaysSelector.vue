<!-- src/components/barbers/WorkingDaysSelector.vue -->
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Ngày làm việc</label>
    <div class="flex flex-wrap gap-2">
      <label
        v-for="day in daysOfWeek"
        :key="day.value"
        class="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
        :class="isSelected(day.value) ? 'bg-blue-50 border-blue-500' : 'border-gray-300'"
      >
        <input
          type="checkbox"
          :value="day.value"
          :checked="isSelected(day.value)"
          @change="toggleDay(day.value)"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span class="text-sm">{{ day.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { DAYS_OF_WEEK } from '@/constants/barbers.contans'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const daysOfWeek = DAYS_OF_WEEK

const isSelected = (value) => {
  return props.modelValue.includes(value)
}

const toggleDay = (value) => {
  const newValue = isSelected(value)
    ? props.modelValue.filter(d => d !== value)
    : [...props.modelValue, value]
  
  emit('update:modelValue', newValue)
}
</script>