<!-- src/components/appointments/AppointmentActions.vue -->
<template>
  <div class="flex gap-2">
    <button
      v-if="canConfirm"
      @click="$emit('confirm')"
      :disabled="isProcessing"
      class="text-green-600 hover:text-green-800 disabled:opacity-50"
      title="Xác nhận"
    >
      <CheckIcon class="w-5 h-5" />
    </button>
    
    <button
      v-if="canCancel"
      @click="$emit('cancel')"
      :disabled="isProcessing"
      class="text-red-600 hover:text-red-800 disabled:opacity-50"
      title="Hủy"
    >
      <XMarkIcon class="w-5 h-5" />
    </button>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { APPOINTMENT_STATUS } from '@/constants/appointment.constant'

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel', 'delete'])

const canConfirm = computed(() => 
  props.appointment.status === APPOINTMENT_STATUS.PENDING
)

const canCancel = computed(() => 
  props.appointment.status !== APPOINTMENT_STATUS.CANCELLED
)
</script>