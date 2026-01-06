export interface UpdateAppointmentPayload {
  appointment_time?: string
  note?: string
}

export interface ConfirmAppointmentPayload {
  admin_id: number
  admin_note?: string
}