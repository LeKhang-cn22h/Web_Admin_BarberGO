import apiClient from 'axios'
import type { AxiosResponse } from 'axios'

import type { Appointment } from '@/models/appointment.model'
import type {
  UpdateAppointmentPayload,
  ConfirmAppointmentPayload,
} from '@/types/appointment.type'

const appointmentApi = {
  // Get all appointments
  getAll(): Promise<AxiosResponse<Appointment[]>> {
    return apiClient.get('/appointments/')
  },

  // Get by ID

  getById(id: number): Promise<AxiosResponse<Appointment>> {
    return apiClient.get(`/appointments/${id}`)
  },

  // Get by user
  getByUser(userId: number): Promise<AxiosResponse<Appointment[]>> {
    return apiClient.get(`/appointments/user/${userId}`)
  },

  // Get by status
  getByStatus(status: string): Promise<AxiosResponse<Appointment[]>> {
    return apiClient.get(`/appointments/status/${status}`)
  },

  // Update appointment
  update(
    id: number,
    data: UpdateAppointmentPayload
  ): Promise<AxiosResponse<Appointment>> {
    return apiClient.patch(`/appointments/${id}`, data)
  },

  // Update status
  updateStatus(
    id: number,
    status: string
  ): Promise<AxiosResponse<Appointment>> {
    return apiClient.patch(
      `/appointments/${id}/status`,
      null,
      { params: { status } }
    )
  },

  // Confirm
  confirm(
    id: number,
    payload: ConfirmAppointmentPayload
  ): Promise<AxiosResponse<Appointment>> {
    return apiClient.patch(
      `/appointments/${id}/confirm`,
      payload
    )
  },

  // Cancel
  cancel(
    id: number,
    note: string
  ): Promise<AxiosResponse<Appointment>> {
    return apiClient.patch(
      `/appointments/${id}/cancel`,
      { admin_note: note }
    )
  },

  // Delete
  delete(id: number): Promise<void> {
    return apiClient.delete(`/appointments/${id}`)
  },
}

export default appointmentApi
