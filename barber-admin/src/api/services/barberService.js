import apiClient from '../axios'

export default {
  getAll(skip = 0, limit = 100) {
    return apiClient.get('/barbers/', { params: { skip, limit } })
  },

  getById(id) {
    return apiClient.get(`/barbers/${id}`)
  },

  getTopBarbers(limit = 2) {
    return apiClient.get('/barbers/top', { params: { limit } })
  },

  create(data) {
    return apiClient.post('/barbers/', data)
  },

  update(id, data) {
    return apiClient.put(`/barbers/${id}`, data)
  },

  updateLocation(id, lat, lng) {
    return apiClient.put(`/barbers/${id}/location`, { lat, lng })
  },

  uploadImage(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`/barbers/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}