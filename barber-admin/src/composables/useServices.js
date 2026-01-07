// src/composables/useServices.js
import { ref, computed } from 'vue'
import { useBarberStore } from '@/stores/barber'
import { useNotification } from '@/composables/useNotification'

export function useServices(barberId) {
  const store = useBarberStore()
  const { showSuccess, showError } = useNotification()
  const isProcessing = ref(false)

  const services = computed(() => store.services)
  const isLoading = computed(() => store.isLoadingServices)

  /**
   * Fetch services
   */
  const fetchServices = async () => {
    if (!barberId) return
    
    try {
      await store.fetchServices(barberId)
    } catch (error) {
      showError('Không thể tải danh sách dịch vụ')
    }
  }

  /**
   * Create service
   */
  const createService = async (data) => {
    isProcessing.value = true
    try {
      await store.createService({
        ...data,
        barber_id: barberId
      })
      showSuccess('Tạo dịch vụ mới thành công')
    } catch (error) {
      showError(error.message || 'Không thể tạo dịch vụ mới')
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Update service
   */
  const updateService = async (id, data) => {
    isProcessing.value = true
    try {
      await store.updateService(id, data)
      showSuccess('Cập nhật dịch vụ thành công')
    } catch (error) {
      showError(error.message || 'Không thể cập nhật dịch vụ')
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Toggle service status
   */
  const toggleServiceStatus = async (service) => {
    const action = service.status ? 'vô hiệu hóa' : 'kích hoạt'
    
    if (!confirm(`Bạn có chắc muốn ${action} dịch vụ này không?`)) {
      return
    }

    isProcessing.value = true
    try {
      await store.toggleServiceStatus(service.id)
      showSuccess(`Đã ${action} dịch vụ thành công`)
    } catch (error) {
      showError(`Không thể ${action} dịch vụ`)
    } finally {
      isProcessing.value = false
    }
  }

  return {
    // State
    services,
    isLoading,
    isProcessing,

    // Actions
    fetchServices,
    createService,
    updateService,
    toggleServiceStatus
  }
}