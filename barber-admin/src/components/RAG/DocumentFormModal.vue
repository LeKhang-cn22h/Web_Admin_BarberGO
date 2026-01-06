<!-- src/components/RAG/DocumentFormModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <h3 class="text-xl font-bold text-white">
          {{ isEdit ? 'Edit Document' : 'Add New Document' }}
        </h3>
        <button @click="$emit('close')" class="text-white hover:text-gray-200">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Content (Question/Input) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Content (Question/Input) <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.content"
            required
            rows="4"
            class="input-field"
            placeholder="e.g., Làm thế nào để đặt lịch trên app?"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Câu hỏi hoặc input mà user có thể hỏi
          </p>
        </div>

        <!-- Output (Answer) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Output (Answer) <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.output"
            required
            rows="6"
            class="input-field"
            placeholder="e.g., Để đặt lịch trên BarberGo: 1. Mở app... 2. Chọn dịch vụ..."
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Câu trả lời hoặc thông tin cần cung cấp
          </p>
        </div>

        <!-- Instruction -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Instruction
          </label>
          <input
            v-model="form.instruction"
            type="text"
            class="input-field"
            placeholder="e.g., Đối tác hỏi về hợp tác, Khách hàng hỏi về dịch vụ"
          />
          <p class="text-xs text-gray-500 mt-1">
            Mô tả ngắn gọn về ngữ cảnh câu hỏi (optional)
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✅ {{ isEdit ? 'Document updated successfully!' : 'Document created successfully!' }}
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 btn-primary disabled:opacity-50"
          >
            {{ isLoading ? 'Saving...' : (isEdit ? 'Update Document' : 'Create Document') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ragService from '@/api/services/ragService'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  document: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const isEdit = computed(() => !!props.document)
const isLoading = ref(false)
const error = ref('')
const success = ref(false)

const form = ref({
  content: '',
  output: '',
  instruction: ''
})

// Load existing data if editing
watch(() => props.document, (newDoc) => {
  if (newDoc) {
    form.value = {
      content: newDoc.content || '',
      output: newDoc.metadata?.output || '',
      instruction: newDoc.metadata?.instruction || ''
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  isLoading.value = true

  try {
    // Build metadata (chỉ có instruction)
    const extraMetadata = {
      instruction: form.value.instruction || undefined
    }

    if (isEdit.value) {
      // Update existing document
      await ragService.updateDocument(props.document.id, {
        new_content: form.value.content,
        new_output: form.value.output,
        new_metadata: extraMetadata
      })
    } else {
      // Create new document
      await ragService.createDocument({
        content: form.value.content,
        output: form.value.output,
        extra_metadata: extraMetadata
      })
    }

    success.value = true
    setTimeout(() => {
      emit('success')
    }, 1000)

  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to save document'
  } finally {
    isLoading.value = false
  }
}
</script>