// src/api/services/appointmentService.js
import apiClient from '../axios'

export default {
  // Get all appointments
  getAll() {
    return apiClient.get('/appointments/')
  },

  // Get by ID
  getById(id) {
    return apiClient.get(`/appointments/${id}`)
  },

  // Get by user
  getByUser(userId) {
    return apiClient.get(`/appointments/user/${userId}`)
  },

  // Get by status
  getByStatus(status) {
    return apiClient.get(`/appointments/status/${status}`)
  },

  // Update appointment
  update(id, data) {
    return apiClient.patch(`/appointments/${id}`, data)
  },

  // Update status
  updateStatus(id, status) {
    return apiClient.patch(`/appointments/${id}/status?status=${status}`)
  },

  // Confirm
  confirm(id, adminId, note) {
    return apiClient.patch(`/appointments/${id}/confirm`, { admin_id: adminId, admin_note: note })
  },

  // Cancel
  cancel(id, note) {
    return apiClient.patch(`/appointments/${id}/cancel`, { admin_note: note })
  },

  // Delete
  delete(id) {
    return apiClient.delete(`/appointments/${id}`)
  }
}