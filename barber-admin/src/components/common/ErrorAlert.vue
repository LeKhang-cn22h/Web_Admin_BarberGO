<!-- src/components/common/ErrorAlert.vue -->
<template>
  <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  }
})
</script>