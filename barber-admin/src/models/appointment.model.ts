export interface Appointment {
  id: number
  user_id: number
  status: string
  appointment_time: string
  note?: string
  admin_id?: number
  admin_note?: string
  created_at: string
  updated_at: string
}
