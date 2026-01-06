import apiClient from '../axios'

export default {
  // ==================== CHAT ====================
  sendMessage(data) {
    return apiClient.post('/api/chatbot/chat', data)
  },

  // ==================== SESSIONS ====================
  createSession(userId, title) {
    return apiClient.post('/api/chatbot/sessions', { user_id: userId, title })
  },

  getUserSessions(userId, limit = 20) {
    return apiClient.get(`/api/chatbot/sessions/${userId}`, { params: { limit } })
  },

  getSessionMessages(sessionId) {
    return apiClient.get(`/api/chatbot/sessions/${sessionId}/messages`)
  },

  updateSessionTitle(sessionId, title) {
    return apiClient.put(`/api/chatbot/sessions/${sessionId}`, { title })
  },

  deleteSession(sessionId) {
    return apiClient.delete(`/api/chatbot/sessions/${sessionId}`)
  },

  // ==================== DOCUMENTS ====================
  getAllDocuments(limit = 100, offset = 0) {
    return apiClient.get('/api/chatbot/documents', { params: { limit, offset } })
  },

  getDocumentById(documentId) {
    return apiClient.get(`/api/chatbot/documents/${documentId}`)
  },

  searchDocuments(keyword) {
    return apiClient.get('/api/chatbot/documents/search/keyword', { params: { keyword } })
  },

  createDocument(data) {
    return apiClient.post('/api/chatbot/documents', data)
  },

  updateDocument(documentId, data) {
    return apiClient.put(`/api/chatbot/documents/${documentId}`, data)
  },

  deleteDocument(documentId) {
    return apiClient.delete(`/api/chatbot/documents/${documentId}`)
  },

  // ==================== HEALTH ====================
  healthCheck() {
    return apiClient.get('/api/chatbot/health')
  },

  testChatbot() {
    return apiClient.get('/api/chatbot/test')
  }
}