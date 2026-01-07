// src/api/services/barberService.js
import apiClient from '../axios'
import { BARBER_API_ENDPOINTS, IMAGE_UPLOAD_CONFIG } from '@/constants/barbers.contans'
/**
 * Barber Service
 * Handles all barber-related API calls
 */
class BarberService {
  /**
   * Validate image file before upload
   * @private
   */
  validateImageFile(file) {
    if (!file) {
      throw new Error('Không có file nào được chọn')
    }

    if (file.size > IMAGE_UPLOAD_CONFIG.MAX_SIZE) {
      throw new Error(`Kích thước file phải nhỏ hơn ${IMAGE_UPLOAD_CONFIG.MAX_SIZE / (1024 * 1024)}MB`)
    }

    if (!IMAGE_UPLOAD_CONFIG.ACCEPTED_TYPES.includes(file.type)) {
      throw new Error('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WEBP')
    }

    return true
  }

  /**
   * Handle API errors
   * @private
   */
  handleError(error, defaultMessage) {
    const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    error.message || 
                    defaultMessage
    throw new Error(message)
  }

  /**
   * Get all barbers with pagination
   * @param {number} skip - Number of records to skip
   * @param {number} limit - Maximum number of records to return
   * @returns {Promise<Array>}
   */
  async getAll(skip = 0, limit = 100) {
    try {
      const response = await apiClient.get(BARBER_API_ENDPOINTS.BASE, {
        params: { skip, limit }
      })
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể tải danh sách thợ')
    }
  }

  /**
   * Get barber by ID
   * @param {string|number} id - Barber ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await apiClient.get(BARBER_API_ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      this.handleError(error, `Không thể tải thông tin thợ ${id}`)
    }
  }

  /**
   * Get top rated barbers
   * @param {number} limit - Number of barbers to return
   * @returns {Promise<Array>}
   */
  async getTopBarbers(limit = 2) {
    try {
      const response = await apiClient.get(BARBER_API_ENDPOINTS.TOP, {
        params: { limit }
      })
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể tải danh sách thợ hàng đầu')
    }
  }

  /**
   * Create new barber
   * @param {Object} data - Barber data
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      const response = await apiClient.post(BARBER_API_ENDPOINTS.BASE, data)
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể tạo thợ mới')
    }
  }

  /**
   * Update barber
   * @param {string|number} id - Barber ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    try {
      const response = await apiClient.put(BARBER_API_ENDPOINTS.BY_ID(id), data)
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể cập nhật thông tin thợ')
    }
  }

  /**
   * Update barber location
   * @param {string|number} id - Barber ID
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>}
   */
  async updateLocation(id, lat, lng) {
    try {
      const response = await apiClient.put(BARBER_API_ENDPOINTS.LOCATION(id), {
        lat,
        lng
      })
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể cập nhật vị trí')
    }
  }

  /**
   * Upload barber image
   * @param {string|number} id - Barber ID
   * @param {File} file - Image file
   * @returns {Promise<Object>}
   */
  async uploadImage(id, file) {
    try {
      // Validate file
      this.validateImageFile(file)

      const formData = new FormData()
      formData.append('file', file)

      const response = await apiClient.post(
        BARBER_API_ENDPOINTS.UPLOAD_IMAGE(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể tải lên ảnh')
    }
  }

  /**
   * Delete barber
   * @param {string|number} id - Barber ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await apiClient.delete(BARBER_API_ENDPOINTS.BY_ID(id))
    } catch (error) {
      this.handleError(error, 'Không thể xóa thợ')
    }
  }
}

export default new BarberService()