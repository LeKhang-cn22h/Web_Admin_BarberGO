// src/constants/appointment.constants.js
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.PENDING]: 'Chờ xử lý',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Đã xác nhận',
  [APPOINTMENT_STATUS.CANCELLED]: 'Đã hủy'
}

export const APPOINTMENT_STATUS_CLASSES = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-orange-100 text-orange-800',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-green-100 text-green-800',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
}

export const APPOINTMENT_API_ENDPOINTS = {
  APPOINTMENTS: '/appointments',
  APPOINTMENT_BY_ID: (id) => `/appointments/${id}`,
  APPOINTMENT_BY_USER: (userId) => `/appointments/user/${userId}`,
  APPOINTMENT_BY_STATUS: (status) => `/appointments/status/${status}`,
  APPOINTMENT_STATUS: (id, status) => `/appointments/${id}/status?status=${status}`,
  APPOINTMENT_CONFIRM: (id) => `/appointments/${id}/confirm`,
  APPOINTMENT_CANCEL: (id) => `/appointments/${id}/cancel`
}