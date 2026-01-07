// src/api/services/appointmentService.js
import apiClient from '../axios'
import { APPOINTMENT_API_ENDPOINTS } from '@/constants/appointment.constant'
/**
 * Appointment Service
 * Handles all appointment-related API calls
 */
class AppointmentService {
  /**
   * Get all appointments
   * @returns {Promise<Array>}
   */
  async getAll() {
    try {
      const response = await apiClient.get(APPOINTMENT_API_ENDPOINTS.APPOINTMENTS)
      return response.data
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch appointments')
    }
  }

  /**
   * Get appointment by ID
   * @param {string|number} id - Appointment ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await apiClient.get(APPOINTMENT_API_ENDPOINTS.APPOINTMENT_BY_ID(id))
      return response.data
    } catch (error) {
      throw this.handleError(error, `Failed to fetch appointment ${id}`)
    }
  }

  /**
   * Get appointments by user ID
   * @param {string|number} userId - User ID
   * @returns {Promise<Array>}
   */
  async getByUser(userId) {
    try {
      const response = await apiClient.get(APPOINTMENT_API_ENDPOINTS.APPOINTMENT_BY_USER(userId))
      return response.data
    } catch (error) {
      throw this.handleError(error, `Failed to fetch appointments for user ${userId}`)
    }
  }

  /**
   * Get appointments by status
   * @param {string} status - Appointment status
   * @returns {Promise<Array>}
   */
  async getByStatus(status) {
    try {
      const response = await apiClient.get(APPOINTMENT_API_ENDPOINTS.APPOINTMENT_BY_STATUS(status))
      return response.data
    } catch (error) {
      throw this.handleError(error, `Failed to fetch ${status} appointments`)
    }
  }

  /**
   * Update appointment
   * @param {string|number} id - Appointment ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    try {
      const response = await apiClient.patch(APPOINTMENT_API_ENDPOINTS.APPOINTMENT_BY_ID(id), data)
      return response.data
    } catch (error) {
      throw this.handleError(error, 'Failed to update appointment')
    }
  }

  /**
   * Update appointment status
   * @param {string|number} id - Appointment ID
   * @param {string} status - New status
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    try {
      const response = await apiClient.patch(APPOINTMENT_API_ENDPOINTS.APPOINTMENT_STATUS(id, status))
      return response.data
    } catch (error) {
      throw this.handleError(error, 'Failed to update appointment status')
    }
  }

  /**
   * Confirm appointment
   * @param {string|number} id - Appointment ID
   * @param {string|number} adminId - Admin ID
   * @param {string} note - Admin note
   * @returns {Promise<Object>}
   */
  async confirm(id, adminId, note) {
    try {
      const response = await apiClient.patch(APPOINTMENT_API_ENDPOINTS.APPOINTMENT_CONFIRM(id), {
        admin_id: adminId,
        admin_note: note
      })
      return response.data
    } catch (error) {
      throw this.handleError(error, 'Failed to confirm appointment')
    }
  }

  /**
   * Cancel appointment
   * @param {string|number} id - Appointment ID
   * @param {string} note - Cancellation reason
   * @returns {Promise<Object>}
   */
  async cancel(id, note) {
    try {
      const response = await apiClient.patch(APPOINTMENT_API_ENDPOINTS.APPOINTMENT_CANCEL(id), {
        admin_note: note
      })
      return response.data
    } catch (error) {
      throw this.handleError(error, 'Failed to cancel appointment')
    }
  }

  /**
   * Delete appointment
   * @param {string|number} id - Appointment ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await apiClient.delete(APPOINTMENT_API_ENDPOINTS.APPOINTMENT_BY_ID(id))
    } catch (error) {
      throw this.handleError(error, 'Failed to delete appointment')
    }
  }

  /**
   * Handle API errors
   * @private
   */
  handleError(error, defaultMessage) {
    const message = error.response?.data?.message || error.message || defaultMessage
    return new Error(message)
  }
}

export default new AppointmentService()