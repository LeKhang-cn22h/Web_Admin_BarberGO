import { ref, computed } from 'vue'
import { useAppointmentStore } from '@/stores/appointment'
import { useBarberStore } from '@/stores/barber'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'
import { emailApi } from '@/api/emailApi'
import { generateSecurePassword, transformToOwnerEmail } from '@/utils/password'

export function useAppointments() {
  const appointmentStore = useAppointmentStore()
  const barberStore = useBarberStore()
  const authStore = useAuthStore()
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
   * Xử lý xác nhận và tạo Owner + Barber + Gửi Email
   */
  const handleConfirmWithBarber = async (barberData) => {
    if (!selectedAppointment.value || !pendingAdminId.value) {
      showError('Thiếu thông tin cần thiết')
      return
    }

    isProcessing.value = true
    
    try {
      const appointment = selectedAppointment.value
      
      console.log('=== START WORKFLOW ===')
      console.log('Appointment:', appointment)
      
      // BƯỚC 1: Tạo tài khoản Owner
      const ownerEmail = transformToOwnerEmail(appointment.email)
      const ownerPassword = generateSecurePassword(12)
      
      console.log('Step 1: Creating owner account...')
      console.log('Owner email:', ownerEmail)
      console.log('Owner password:', ownerPassword)
      
      const ownerData = {
        email: ownerEmail,
        password: ownerPassword,
        full_name: appointment.users?.full_name || appointment.name_barber || 'Owner',
        phone: appointment.phone || ''
      }
      
      console.log('Calling authStore.createOwner with:', ownerData)
      
      const ownerResult = await authStore.createOwner(ownerData)
      
      console.log('Owner result:', ownerResult)
      
      // ✅ FIX: Kiểm tra kỹ response structure
      if (!ownerResult || !ownerResult.success) {
        const errorMsg = ownerResult?.error || 'Không thể tạo tài khoản Owner'
        console.error('❌ Create owner failed:', errorMsg)
        throw new Error(errorMsg)
      }
      
      const newOwner = ownerResult.data
      
      // ✅ FIX: Kiểm tra newOwner có id không
      if (!newOwner || !newOwner.id) {
        console.error('❌ Owner data is invalid:', newOwner)
        throw new Error('Dữ liệu Owner không hợp lệ (thiếu ID)')
      }
      
      console.log('✅ Owner created successfully:', newOwner)
      console.log('Owner ID:', newOwner.id)
      
      // BƯỚC 2: Xác nhận appointment
      console.log('Step 2: Confirming appointment...')
      await appointmentStore.confirmAppointment(
        appointment.id,
        pendingAdminId.value,
        `Đã xác nhận và tạo Owner (ID: ${newOwner.id}, Email: ${ownerEmail})`
      )
      console.log('✅ Appointment confirmed')
      
      // BƯỚC 3: Tạo barber với user_id của Owner vừa tạo
      console.log('Step 3: Creating barber...')
      console.log('Barber data from form:', JSON.stringify(barberData, null, 2))
      console.log('Barber data from form:', barberData)
      
      const barberPayload = {
        ...barberData,
        user_id: newOwner.id // Gắn barber với owner vừa tạo
      }
      
      console.log('Barber payload with owner_id:', barberPayload)
      
      const newBarber = await barberStore.createBarber(barberPayload)
      console.log('✅ Barber created:', newBarber)
      
      // BƯỚC 4: Gửi email đơn giản chỉ có email và password
      console.log('Step 4: Sending email...')
      
      await emailApi.sendOwnerCredentials({
        recipient: appointment.email, // Email gốc của appointment
        email: ownerEmail, // Email để đăng nhập
        password: ownerPassword // Password để đăng nhập
      })
      
      console.log('✅ Email sent to:', appointment.email)
      console.log('=== WORKFLOW COMPLETED ===')
      
      showSuccess(
        `✅ Thành công!\n\n` +
        `• Tạo Owner: ${ownerEmail}\n` +
        `• Owner ID: ${newOwner.id}\n` +
        `• Tạo Barber: ${newBarber.name}\n` +
        `• Email đã gửi đến: ${appointment.email}`
      )
      
      closeConfirmModal()
      
      // Refresh appointments list
      await fetchAppointments()
      
    } catch (error) {
      console.error('❌ Error in handleConfirmWithBarber:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        error: error
      })
      showError(error.message || 'Có lỗi xảy ra trong quá trình xử lý')
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
      await fetchAppointments()
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
      await fetchAppointments()
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
    filterByStatus
  }
}