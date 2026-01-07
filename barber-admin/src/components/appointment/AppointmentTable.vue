<!-- src/components/appointments/AppointmentTable.vue -->
<template>
  <div class="card">
    <LoadingSpinner v-if="isLoading" message="Đang tải..." />

    <div v-else>
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="table-header">Khách hàng</th>
            <th class="table-header">Tiệm</th>
            <th class="table-header">Số điện thoại</th>
            <th class="table-header">Email</th>
            <th class="table-header">Trạng thái</th>
            <th class="table-header">Tạo lúc</th>
            <th class="table-header">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <AppointmentTableRow
            v-for="appointment in appointments"
            :key="appointment.id"
            :appointment="appointment"
            :is-processing="isProcessing"
            @confirm="$emit('confirm', appointment)"
            @cancel="$emit('cancel', appointment)"
            @delete="$emit('delete', appointment)"
          />
        </tbody>
      </table>

      <EmptyState v-if="appointments.length === 0" message="Không có lịch hẹn nào" />
    </div>
  </div>
</template>

<script setup>
import AppointmentTableRow from './AppointmentTableRow.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'

defineProps({
  appointments: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel', 'delete'])
</script>

<style scoped>
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase;
}
</style>