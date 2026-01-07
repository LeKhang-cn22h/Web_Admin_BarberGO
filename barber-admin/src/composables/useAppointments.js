// src/composables/useAppointments.js
import { ref, computed } from 'vue'
import { useAppointmentStore } from '@/stores/appointment'
import { useBarberStore } from '@/stores/barber'
import { useNotification } from '@/composables/useNotification'
import { APPOINTMENT_STATUS_CLASSES } from '@/constants/appointment.constant'

export function useAppointments() {
  const appointmentStore = useAppointmentStore()
  const barberStore = useBarberStore()
  const { showSuccess, showError } = useNotification()
  const isProcessing = ref(false)
  
  // Modal state
  const showConfirmModal = ref(false)
  const selectedAppointment = ref(null)
  const pendingAdminId = ref(null)

  const appointments = computed(() => appointmentStore.filteredAppointments)
  const statistics = computed(() => appointmentStore.statistics)
  const isLoading = computed(() => appointmentStore.isLoading)

  /**
   * Fetch all appointments
   */
  const fetchAppointments = async () => {
    try {
      await appointmentStore.fetchAll()
    } catch (error) {
      showError(`Không thể tải danh sách lịch hẹn: ${error.message}`)
    }
  }

  /**
   * Tạo barber từ dữ liệu form
   */
  const createBarberFromForm = async (barberData) => {
    try {
      const newBarber = await barberStore.createBarber(barberData)
      return newBarber
    } catch (error) {
      console.error('Error creating barber:', error)
      throw error
    }
  }

  /**
   * Mở modal xác nhận tạo barber
   */
  const openConfirmModal = (appointment, adminId) => {
    if (!appointment) {
      showError('Thông tin lịch hẹn không hợp lệ')
      return
    }
    
    if (!adminId) {
      showError('Không xác định được admin ID')
      return
    }
    
    selectedAppointment.value = appointment
    pendingAdminId.value = adminId
    showConfirmModal.value = true
  }

  /**
   * Đóng modal
   */
  const closeConfirmModal = () => {
    showConfirmModal.value = false
    selectedAppointment.value = null
    pendingAdminId.value = null
  }

  /**
   * Xử lý xác nhận từ modal
   */
  const handleConfirmWithBarber = async (barberData) => {
    if (!selectedAppointment.value || !pendingAdminId.value) {
      showError('Thiếu thông tin cần thiết')
      return
    }

    // Đảm bảo user_id trong barberData là từ appointment (người đặt lịch)
    // Không phải từ admin đang confirm
    if (!barberData.user_id) {
      barberData.user_id = selectedAppointment.value.user_id
    }

    isProcessing.value = true
    try {
      // 1. Xác nhận appointment (dùng pendingAdminId - admin đang confirm)
      await appointmentStore.confirmAppointment(
        selectedAppointment.value.id,
        pendingAdminId.value, // Admin ID
        'Đã xác nhận bởi admin và tạo thợ tự động'
      )

      // 2. Tạo barber với user_id từ appointment (người đặt lịch)
      const newBarber = await createBarberFromForm(barberData)
      
      showSuccess(`Đã xác nhận lịch hẹn và tạo thợ "${newBarber.name}" cho User ID: ${barberData.user_id}`)
      closeConfirmModal()
      
    } catch (error) {
      console.error('Error in handleConfirmWithBarber:', error)
      showError(error.message || 'Có lỗi xảy ra')
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Confirm appointment - mở modal
   */
  const confirmAppointment = async (appointment, adminId) => {
    openConfirmModal(appointment, adminId)
  }

  /**
   * Cancel appointment
   */
  const cancelAppointment = async (appointment) => {
    if (!appointment) {
      showError('Thông tin lịch hẹn không hợp lệ')
      return
    }

    const reason = prompt('Lý do hủy lịch:')
    if (!reason) return

    isProcessing.value = true
    try {
      await appointmentStore.cancelAppointment(appointment.id, reason)
      showSuccess('Đã hủy lịch hẹn')
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      showError(`Không thể hủy lịch hẹn: ${error.message}`)
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Delete appointment
   */
  const deleteAppointment = async (appointment) => {
    if (!appointment) {
      showError('Thông tin lịch hẹn không hợp lệ')
      return
    }

    if (!confirm('Bạn có chắc muốn xóa lịch hẹn này?')) return

    isProcessing.value = true
    try {
      await appointmentStore.deleteAppointment(appointment.id)
      showSuccess('Đã xóa lịch hẹn')
    } catch (error) {
      console.error('Error deleting appointment:', error)
      showError(`Không thể xóa lịch hẹn: ${error.message}`)
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Filter by status
   */
  const filterByStatus = (status) => {
    appointmentStore.setFilter('status', status)
  }

  /**
   * Get status class
   */
  const getStatusClass = (status) => {
    return APPOINTMENT_STATUS_CLASSES[status] || 'bg-gray-100 text-gray-800'
  }

  return {
    // State
    appointments,
    statistics,
    isLoading,
    isProcessing,
    showConfirmModal,
    selectedAppointment,
    
    // Actions
    fetchAppointments,
    confirmAppointment,
    handleConfirmWithBarber,
    closeConfirmModal,
    cancelAppointment,
    deleteAppointment,
    filterByStatus,
    
    // Utils
    getStatusClass
  }
}