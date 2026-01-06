import { defineStore } from 'pinia'
import type { Appointment } from '@/models/appointment.model'
import {
  getAppointmentsByUser,
  getAppointmentById,
  getAppointmentsByStatus,
  confirmAppointment,
  cancelAppointment,
  deleteAppointment,
} from '@/services/appointment.service'
import type { ConfirmAppointmentPayload } from '@/types/appointment.type'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [] as Appointment[],
    selectedAppointment: null as Appointment | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchByUser(userId: number) {
      this.loading = true
      this.error = null
      try {
        this.appointments = await getAppointmentsByUser(userId)
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Lỗi không xác định'
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: number) {
      this.loading = true
      try {
        this.selectedAppointment = await getAppointmentById(id)
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Lỗi không xác định'
      } finally {
        this.loading = false
      }
    },

    async fetchByStatus(status: string) {
      this.loading = true
      try {
        this.appointments = await getAppointmentsByStatus(status)
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Lỗi không xác định'
      } finally {
        this.loading = false
      }
    },

    async confirm(id: number, payload: ConfirmAppointmentPayload) {
      try {
        const updated = await confirmAppointment(id, payload)
        this.appointments = this.appointments.map(a =>
          a.id === id ? updated : a
        )
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Lỗi không xác định'
      }
    },

    async cancel(id: number, note: string) {
      try {
        const updated = await cancelAppointment(id, note)
        this.appointments = this.appointments.map(a =>
          a.id === id ? updated : a
        )
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Lỗi không xác định'
      }
    },

    async remove(id: number) {
      try {
        await deleteAppointment(id)
        this.appointments = this.appointments.filter(a => a.id !== id)
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Lỗi không xác định'
      }
    },
  },
})
