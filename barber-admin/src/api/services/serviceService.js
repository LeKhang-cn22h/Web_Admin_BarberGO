// src/api/services/serviceService.js
import apiClient from '../axios'
import { SERVICE_API_ENDPOINTS } from '@/constants/barbers.contans'

/**
 * Service Service
 * Handles all barber service-related API calls
 */
class ServiceService {
  handleError(error, defaultMessage) {
    const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    error.message || 
                    defaultMessage
    throw new Error(message)
  }

  /**
   * Get all services for a barber
   * @param {string|number} barberId - Barber ID
   * @returns {Promise<Array>}
   */
  async getByBarber(barberId) {
    try {
      const response = await apiClient.get(SERVICE_API_ENDPOINTS.BY_BARBER(barberId))
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể tải danh sách dịch vụ')
    }
  }

  /**
   * Get service by ID
   * @param {string|number} id - Service ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await apiClient.get(SERVICE_API_ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể tải thông tin dịch vụ')
    }
  }

  /**
   * Create new service
   * @param {Object} data - Service data
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      const response = await apiClient.post(SERVICE_API_ENDPOINTS.BASE, data)
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể tạo dịch vụ mới')
    }
  }

  /**
   * Update service
   * @param {string|number} id - Service ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    try {
      const response = await apiClient.put(SERVICE_API_ENDPOINTS.BY_ID(id), data)
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể cập nhật dịch vụ')
    }
  }

  /**
   * Toggle service status
   * @param {string|number} id - Service ID
   * @returns {Promise<Object>}
   */
  async toggleStatus(id) {
    try {
      const response = await apiClient.patch(SERVICE_API_ENDPOINTS.TOGGLE_STATUS(id))
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể thay đổi trạng thái dịch vụ')
    }
  }

  /**
   * Delete service
   * @param {string|number} id - Service ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await apiClient.delete(SERVICE_API_ENDPOINTS.BY_ID(id))
    } catch (error) {
      this.handleError(error, 'Không thể xóa dịch vụ')
    }
  }
}

export default new ServiceService()