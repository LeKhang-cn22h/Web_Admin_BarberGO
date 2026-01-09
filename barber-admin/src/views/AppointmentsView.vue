<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <AppointmentStats :statistics="statistics" />

    <!-- Filters -->
    <AppointmentFilters
      :selected-status="selectedStatus"
      @filter-change="handleFilterChange"
    />

    <!-- Table -->
    <AppointmentTable
      :appointments="appointments"
      :is-loading="isLoading"
      :is-processing="isProcessing"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @delete="handleDelete"
    />

    <!-- Confirm Barber Creation Modal -->
    <ConfirmBarberCreationModal
      v-if="showConfirmModal && selectedAppointment"
      :appointment="selectedAppointment"
      :is-processing="isProcessing"
      @confirm="handleConfirmWithBarber"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppointments } from '@/composables/useAppointments'
import { useAuthStore } from '@/stores/auth'
import AppointmentStats from '@/components/appointment/AppointmentStats.vue'
import AppointmentFilters from '@/components/appointment/AppointmentFilters.vue'
import AppointmentTable from '@/components/appointment/AppointmentTable.vue'
import ConfirmBarberCreationModal from '@/components/appointment/ConfirmBarberCreationModal.vue'

const authStore = useAuthStore()
const selectedStatus = ref('all')

const {
  appointments,
  statistics,
  isLoading,
  isProcessing,
  showConfirmModal,
  selectedAppointment,
  fetchAppointments,
  confirmAppointment,
  handleConfirmWithBarber,
  closeConfirmModal,
  cancelAppointment,
  deleteAppointment,
  filterByStatus
} = useAppointments()

const handleFilterChange = (status) => {
  selectedStatus.value = status
  filterByStatus(status)
}

const handleConfirm = async (appointment) => {
  // Kiểm tra admin authentication
  if (!authStore.user || !authStore.user.id) {
    console.error('Admin not authenticated')
    alert('Vui lòng đăng nhập lại')
    return
  }
  
  // Mở modal
  await confirmAppointment(appointment, authStore.user.id)
}

const handleCancel = async (appointment) => {
  await cancelAppointment(appointment)
}

const handleDelete = async (appointment) => {
  await deleteAppointment(appointment)
}

onMounted(() => {
  fetchAppointments()
})
</script>