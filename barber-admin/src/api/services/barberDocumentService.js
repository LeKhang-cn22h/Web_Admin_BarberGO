import apiClient from '../axios'

export default {
  // ==================== SEARCH ====================
  searchVector(query, topK = 3, threshold = 0.5) {
    return apiClient.get('/api/barber-documents/search', {
      params: { q: query, top_k: topK, threshold }
    })
  },

  searchKeyword(keyword) {
    return apiClient.get(`/api/barber-documents/search/keyword/${keyword}`)
  },

  // ==================== CRUD ====================
  getAll(limit = 100, offset = 0, docType = null) {
    return apiClient.get('/api/barber-documents', {
      params: { limit, offset, ...(docType && { doc_type: docType }) }
    })
  },

  getById(id) {
    return apiClient.get(`/api/barber-documents/${id}`)
  },

  create(data) {
    return apiClient.post('/api/barber-documents', data)
  },

  update(id, data) {
    return apiClient.put(`/api/barber-documents/${id}`, data)
  },

  deleteOne(id) {
    return apiClient.delete(`/api/barber-documents/${id}`)
  },

  deleteByBarber(barberId) {
    return apiClient.delete(`/api/barber-documents/barber/${barberId}`)
  }
}