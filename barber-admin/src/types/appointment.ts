// src/types/appointment.ts
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
  
  // Thông tin để tạo barber
  name_barber?: string
  phone?: string
  email?: string
  address?: string
  area?: string
  location?: {
    lat: number
    lng: number
  }
  
  // Thông tin user
  users?: {
    full_name?: string
    email?: string
    phone?: string
  }
}