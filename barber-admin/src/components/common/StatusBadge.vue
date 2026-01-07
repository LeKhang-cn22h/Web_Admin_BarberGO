<template>
<span :class="badgeClass" class="px-3 py-1 rounded-full text-xs font-medium">
{{ statusLabel }}
</span>
</template>
<script setup>
import { computed } from 'vue'
import { 
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_CLASSES 
} from '@/constants/appointment.constant'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusLabel = computed(() => 
  APPOINTMENT_STATUS_LABELS[props.status] || props.status
)

const badgeClass = computed(() => 
  APPOINTMENT_STATUS_CLASSES[props.status] || 'bg-gray-100 text-gray-800'
)
</script>