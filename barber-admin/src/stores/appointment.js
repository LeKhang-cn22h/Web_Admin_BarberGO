import { defineStore } from 'pinia'
import appointmentService from '@/api/services/appointmentService'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [],
    currentAppointment: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    pendingAppointments: (state) => 
      state.appointments.filter(a => a.status === 'pending'),
    
    confirmedAppointments: (state) => 
      state.appointments.filter(a => a.status === 'confirmed'),
  },

  actions: {
    async fetchAll() {
      this.isLoading = true
      try {
        const response = await appointmentService.getAll()
        this.appointments = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    async fetchByStatus(status) {
      this.isLoading = true
      try {
        const response = await appointmentService.getByStatus(status)
        this.appointments = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    async confirmAppointment(id, adminId, note) {
      try {
        await appointmentService.confirm(id, adminId, note)
        await this.fetchAll()
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    },

    async cancelAppointment(id, note) {
      try {
        await appointmentService.cancel(id, note)
        await this.fetchAll()
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    }
  }
})