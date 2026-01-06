<!-- src/components/RAG/EditSessionModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <h3 class="text-xl font-bold text-white">Edit Session Title</h3>
        <button @click="$emit('close')" class="text-white hover:text-gray-200">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Session Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="newTitle"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Hỏi về đặt lịch"
            maxlength="100"
          />
          <p class="text-xs text-gray-500 mt-1">{{ newTitle.length }}/100 characters</p>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading || !newTitle.trim()"
            class="flex-1 btn-primary disabled:opacity-50"
          >
            {{ isLoading ? 'Saving...' : 'Update' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ragService from '@/api/services/ragService'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  session: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const newTitle = ref(props.session.title)
const isLoading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true

  try {
    await ragService.updateSessionTitle(props.session.id, newTitle.value)
    emit('success')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to update session'
  } finally {
    isLoading.value = false
  }
}
</script>