<!-- src/components/appointments/AppointmentTableRow.vue -->
<template>
  <tr class="hover:bg-gray-50">
    <td class="table-cell">{{ appointment.users?.full_name }}</td>
    <td class="table-cell">{{ appointment.name_barber }}</td>
    <td class="table-cell">{{ formatPhone(appointment.phone) }}</td>
    <td class="table-cell">{{ appointment.email }}</td>
    <td class="table-cell">
      <StatusBadge :status="appointment.status" />
    </td>
    <td class="table-cell text-sm text-gray-600">
      {{ formatDate(appointment.created_at) }}
    </td>
    <td class="table-cell">
      <AppointmentActions
        :appointment="appointment"
        :is-processing="isProcessing"
        @confirm="$emit('confirm')"
        @cancel="$emit('cancel')"
        @delete="$emit('delete')"
      />
    </td>
  </tr>
</template>

<script setup>
import { useFormatters } from '@/composables/useFormatters'
import StatusBadge from '@/components/common/StatusBadge.vue'
import AppointmentActions from './AppointmentActions.vue'

defineProps({
  appointment: {
    type: Object,
    required: true
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel', 'delete'])

const { formatDate, formatPhone } = useFormatters()
</script>

<style scoped>
.table-cell {
  @apply px-6 py-4;
}
</style>