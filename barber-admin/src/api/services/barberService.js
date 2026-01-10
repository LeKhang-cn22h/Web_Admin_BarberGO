// src/api/services/barberService.js
import apiClient from '../axios'
import { BARBER_API_ENDPOINTS, IMAGE_UPLOAD_CONFIG } from '@/constants/barbers.contans'

class BarberService {
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

  handleError(error, defaultMessage) {
    const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    error.message || 
                    defaultMessage
    throw new Error(message)
  }

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

  async getById(id) {
    try {
      const response = await apiClient.get(BARBER_API_ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      this.handleError(error, `Không thể tải thông tin thợ ${id}`)
    }
  }

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

  async create(data) {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('user_id', data.user_id)
      
      const response = await apiClient.post(`${BARBER_API_ENDPOINTS.BASE}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể tạo thợ mới')
    }
  }

  async update(id, data) {
    try {
      const response = await apiClient.put(BARBER_API_ENDPOINTS.BY_ID(id), data)
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể cập nhật thông tin thợ')
    }
  }

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

  async uploadImage(id, file) {
    try {
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

  // ✅ Toggle status - Smart endpoint selection
  async toggleStatus(id, currentStatus) {
    try {
      // If active (true) → call deactivate
      // If inactive (false) → call activate
      const endpoint = currentStatus 
        ? BARBER_API_ENDPOINTS.DEACTIVATE(id) 
        : BARBER_API_ENDPOINTS.ACTIVATE(id)
      
      console.log(`🔄 Toggling barber ${id}: ${currentStatus} → ${!currentStatus}`)
      console.log(`   Calling: ${endpoint}`)
      
      const response = await apiClient.patch(endpoint)
      return response.data
    } catch (error) {
      this.handleError(error, 'Không thể thay đổi trạng thái thợ')
    }
  }

  async delete(id) {
    try {
      await apiClient.delete(BARBER_API_ENDPOINTS.BY_ID(id))
    } catch (error) {
      this.handleError(error, 'Không thể xóa thợ')
    }
  }
}

export default new BarberService()