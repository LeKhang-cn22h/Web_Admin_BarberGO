// src/composables/useBarbers.js
import { ref, computed } from 'vue'
import { useBarberStore } from '@/stores/barber'
import { useNotification } from '@/composables/useNotification'

export function useBarbers() {
  const store = useBarberStore()
  const { showSuccess, showError } = useNotification()
  const isProcessing = ref(false)

  const barbers = computed(() => store.filteredBarbers)
  const currentBarber = computed(() => store.currentBarber)
  const areas = computed(() => store.areas)
  const isLoading = computed(() => store.isLoading)

  /**
   * Fetch all barbers
   */
  const fetchBarbers = async () => {
    try {
      await store.fetchAll()
    } catch (error) {
      showError('Không thể tải danh sách thợ')
    }
  }

  /**
   * Fetch barber by ID
   */
  const fetchBarber = async (id) => {
    try {
      return await store.fetchById(id)
    } catch (error) {
      showError('Không thể tải thông tin thợ')
      throw error
    }
  }

  /**
   * Create barber
   */
  const createBarber = async (data, imageFile) => {
    isProcessing.value = true
    try {
      const barber = await store.createBarber(data)
      
      // Upload image if provided
      if (imageFile && barber.id) {
        await store.uploadBarberImage(barber.id, imageFile)
      }

      showSuccess('Tạo thợ mới thành công')
      return barber
    } catch (error) {
      showError(error.message || 'Không thể tạo thợ mới')
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Update barber
   */
  const updateBarber = async (id, data, imageFile) => {
    isProcessing.value = true
    try {
      await store.updateBarber(id, data)
      
      // Upload image if changed
      if (imageFile) {
        await store.uploadBarberImage(id, imageFile)
      }

      showSuccess('Cập nhật thông tin thợ thành công')
    } catch (error) {
      showError(error.message || 'Không thể cập nhật thông tin thợ')
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Toggle barber status
   */
  const toggleBarberStatus = async (barber) => {
    const action = barber.status ? 'vô hiệu hóa' : 'kích hoạt'
    
    if (!confirm(`Bạn có chắc muốn ${action} thợ này không?`)) {
      return
    }

    isProcessing.value = true
    try {
      await store.updateBarber(barber.id, { status: !barber.status })
      showSuccess(`Đã ${action} thợ thành công`)
    } catch (error) {
      showError(`Không thể ${action} thợ`)
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Delete barber
   */
  const deleteBarber = async (barber) => {
    if (!confirm(`Bạn có chắc muốn xóa thợ "${barber.name}" không?`)) {
      return
    }

    isProcessing.value = true
    try {
      await store.deleteBarber(barber.id)
      showSuccess('Đã xóa thợ thành công')
    } catch (error) {
      showError('Không thể xóa thợ')
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Set filter
   */
  const setFilter = (key, value) => {
    store.setFilter(key, value)
  }

  return {
    // State
    barbers,
    currentBarber,
    areas,
    isLoading,
    isProcessing,

    // Actions
    fetchBarbers,
    fetchBarber,
    createBarber,
    updateBarber,
    toggleBarberStatus,
    deleteBarber,
    setFilter
  }
}