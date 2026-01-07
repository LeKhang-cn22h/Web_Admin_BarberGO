// src/stores/appointment.js
import { defineStore } from 'pinia'
import appointmentService from '@/api/services/appointmentService'
import { APPOINTMENT_STATUS } from '@/constants/appointment.constant'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [],
    currentAppointment: null,
    isLoading: false,
    error: null,
    filters: {
      status: 'all',
      search: ''
    }
  }),

  getters: {
    /**
     * Get appointments by status
     */
    appointmentsByStatus: (state) => (status) => {
      return state.appointments.filter(a => a.status === status)
    },

    pendingAppointments: (state) => 
      state.appointments.filter(a => a.status === APPOINTMENT_STATUS.PENDING),
    
    confirmedAppointments: (state) => 
      state.appointments.filter(a => a.status === APPOINTMENT_STATUS.CONFIRMED),

    completedAppointments: (state) => 
      state.appointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED),

    cancelledAppointments: (state) => 
      state.appointments.filter(a => a.status === APPOINTMENT_STATUS.CANCELLED),

    /**
     * Get appointment statistics
     */
    statistics: (state) => ({
      total: state.appointments.length,
      pending: state.appointments.filter(a => a.status === APPOINTMENT_STATUS.PENDING).length,
      confirmed: state.appointments.filter(a => a.status === APPOINTMENT_STATUS.CONFIRMED).length,
      completed: state.appointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length,
      cancelled: state.appointments.filter(a => a.status === APPOINTMENT_STATUS.CANCELLED).length
    }),

    /**
     * Get filtered appointments
     */
    filteredAppointments: (state) => {
      let filtered = state.appointments

      // Filter by status
      if (state.filters.status !== 'all') {
        filtered = filtered.filter(a => a.status === state.filters.status)
      }

      // Filter by search
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(a => 
          a.users?.full_name?.toLowerCase().includes(search) ||
          a.phone?.includes(search) ||
          a.email?.toLowerCase().includes(search) ||
          a.name_barber?.toLowerCase().includes(search)
        )
      }

      return filtered
    }
  },

  actions: {
    /**
     * Fetch all appointments
     */
    async fetchAll() {
      this.isLoading = true
      this.error = null
      
      try {
        this.appointments = await appointmentService.getAll()
      } catch (error) {
        this.error = error.message
        this.appointments = []
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch appointment by ID
     */
    async fetchById(id) {
      this.isLoading = true
      this.error = null
      
      try {
        this.currentAppointment = await appointmentService.getById(id)
        return this.currentAppointment
      } catch (error) {
        this.error = error.message
        this.currentAppointment = null
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch appointments by user
     */
    async fetchByUser(userId) {
      this.isLoading = true
      this.error = null
      
      try {
        this.appointments = await appointmentService.getByUser(userId)
      } catch (error) {
        this.error = error.message
        this.appointments = []
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch appointments by status
     */
    async fetchByStatus(status) {
      this.isLoading = true
      this.error = null
      
      try {
        this.appointments = await appointmentService.getByStatus(status)
      } catch (error) {
        this.error = error.message
        this.appointments = []
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update appointment
     */
    async updateAppointment(id, data) {
      try {
        const updated = await appointmentService.update(id, data)
        
        // Update in local state
        const index = this.appointments.findIndex(a => a.id === id)
        if (index !== -1) {
          this.appointments[index] = updated
        }
        
        if (this.currentAppointment?.id === id) {
          this.currentAppointment = updated
        }
        
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    /**
     * Confirm appointment
     */
    async confirmAppointment(id, adminId, note) {
      try {
        await appointmentService.confirm(id, adminId, note)
        await this.fetchAll()
        return true
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    /**
     * Cancel appointment
     */
    async cancelAppointment(id, note) {
      try {
        await appointmentService.cancel(id, note)
        await this.fetchAll()
        return true
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    /**
     * Delete appointment
     */
    async deleteAppointment(id) {
      try {
        await appointmentService.delete(id)
        
        // Remove from local state
        this.appointments = this.appointments.filter(a => a.id !== id)
        
        if (this.currentAppointment?.id === id) {
          this.currentAppointment = null
        }
        
        return true
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    /**
     * Set filter
     */
    setFilter(key, value) {
      this.filters[key] = value
    },

    /**
     * Reset filters
     */
    resetFilters() {
      this.filters = {
        status: 'all',
        search: ''
      }
    },

    clearError() {
      this.error = null
    }
  }
})