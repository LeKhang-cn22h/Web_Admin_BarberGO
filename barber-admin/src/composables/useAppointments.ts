import { ref, computed } from 'vue'
import { useAppointmentStore } from '@/stores/appointment.store'
import type { Appointment } from '@/models/appointment.model'

export const useAppointments = () => {
  const store = useAppointmentStore()

  const selectedStatus = ref<string>('all')

  const appointments = computed(() => store.appointments)

  const filteredAppointments = computed<Appointment[]>(() => {
    if (selectedStatus.value === 'all') return appointments.value
    return appointments.value.filter(
      a => a.status === selectedStatus.value
    )
  })

  const pendingCount = computed(
    () => appointments.value.filter(a => a.status === 'pending').length
  )
  const confirmedCount = computed(
    () => appointments.value.filter(a => a.status === 'confirmed').length
  )
  const cancelledCount = computed(
    () => appointments.value.filter(a => a.status === 'cancelled').length
  )

  return {
    selectedStatus,
    appointments,
    filteredAppointments,
    pendingCount,
    confirmedCount,
    cancelledCount,
  }
}
