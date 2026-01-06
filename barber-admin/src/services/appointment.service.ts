import appointmentApi from '@/api/services/appointment.api'
import type { Appointment } from '@/models/appointment.model'
import type {
  UpdateAppointmentPayload,
  ConfirmAppointmentPayload,
} from '@/types/appointment.type'

// ================= GET =================

// Get all appointments
export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await appointmentApi.getAll()
    return res.data
  } catch (error) {
    throw new Error(
      'Lỗi khi lấy danh sách cuộc hẹn: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

// Get by user
export const getAppointmentsByUser = async (
  userId: number
): Promise<Appointment[]> => {
  try {
    const res = await appointmentApi.getByUser(userId)
    return res.data
  } catch (error) {
    throw new Error(
      'Lỗi khi lấy cuộc hẹn theo người dùng: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

// Get by id
export const getAppointmentById = async (
  id: number
): Promise<Appointment> => {
  try {
    const res = await appointmentApi.getById(id)
    return res.data
  } catch (error) {
    throw new Error(
      'Lỗi khi lấy thông tin cuộc hẹn: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

// Get by status
export const getAppointmentsByStatus = async (
  status: string
): Promise<Appointment[]> => {
  try {
    const res = await appointmentApi.getByStatus(status)
    return res.data
  } catch (error) {
    throw new Error(
      'Lỗi khi lấy cuộc hẹn theo trạng thái: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

// ================= UPDATE =================

// Update appointment
export const updateAppointment = async (
  id: number,
  payload: UpdateAppointmentPayload
): Promise<Appointment> => {
  try {
    const res = await appointmentApi.update(id, payload)
    return res.data
  } catch (error) {
    throw new Error(
      'Lỗi khi cập nhật cuộc hẹn: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

// Update status
export const updateAppointmentStatus = async (
  id: number,
  status: string
): Promise<Appointment> => {
  try {
    const res = await appointmentApi.updateStatus(id, status)
    return res.data
  } catch (error) {
    throw new Error(
      'Lỗi khi cập nhật trạng thái cuộc hẹn: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

// ================= ACTION =================

// Confirm appointment
export const confirmAppointment = async (
  id: number,
  payload: ConfirmAppointmentPayload
): Promise<Appointment> => {
  try {
    const res = await appointmentApi.confirm(id, payload)
    return res.data
  } catch (error) {
    throw new Error(
      'Lỗi khi xác nhận cuộc hẹn: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

// Cancel appointment
export const cancelAppointment = async (
  id: number,
  note: string
): Promise<Appointment> => {
  try {
    const res = await appointmentApi.cancel(id, note)
    return res.data
  } catch (error) {
    throw new Error(
      'Lỗi khi huỷ cuộc hẹn: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

// Delete appointment
export const deleteAppointment = async (id: number): Promise<void> => {
  try {
    await appointmentApi.delete(id)
  } catch (error) {
    throw new Error(
      'Lỗi khi xoá cuộc hẹn: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}
