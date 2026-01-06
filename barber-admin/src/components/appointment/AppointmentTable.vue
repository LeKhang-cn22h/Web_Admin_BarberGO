<script setup lang="ts">
import type { Appointment } from '@/models/appointment.model'


defineProps<{
  appointments: Appointment[]
  onConfirm: (a: Appointment) => void
  onCancel: (a: Appointment) => void
}>()
</script>
