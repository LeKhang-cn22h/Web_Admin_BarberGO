<!-- src/components/appointments/AppointmentFilters.vue -->
<template>
  <div class="card">
    <div class="flex gap-4">
      <button
        v-for="status in statuses"
        :key="status.value"
        @click="$emit('filter-change', status.value)"
        :class="filterButtonClass(status.value)"
      >
        {{ status.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from '@/constants/appointment.constant'

const props = defineProps({
  selectedStatus: {
    type: String,
    default: 'all'
  }
})

defineEmits(['filter-change'])

const statuses = [
  { value: 'all', label: 'Tất cả' },
  { value: APPOINTMENT_STATUS.PENDING, label: APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS.PENDING] },
  { value: APPOINTMENT_STATUS.CONFIRMED, label: APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS.CONFIRMED] },
  { value: APPOINTMENT_STATUS.COMPLETED, label: APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS.COMPLETED] },
  { value: APPOINTMENT_STATUS.CANCELLED, label: APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS.CANCELLED] }
]

const filterButtonClass = (status) => {
  return [
    'px-4 py-2 rounded-lg font-medium transition',
    props.selectedStatus === status
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  ]
}
</script>