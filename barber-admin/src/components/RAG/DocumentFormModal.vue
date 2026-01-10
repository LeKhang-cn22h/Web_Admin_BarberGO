<!-- src/components/RAG/DocumentFormModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <h3 class="text-xl font-bold text-white">
          {{ isEdit ? 'Chỉnh sửa Document' : 'Thêm Document mới' }}
        </h3>
        <button @click="$emit('close')" class="text-white hover:text-gray-200">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Content (Question) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Câu hỏi <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.content"
            required
            rows="3"
            class="input-field"
            placeholder="VD: Làm thế nào để đặt lịch trên app?"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Câu hỏi mà user có thể hỏi (dùng để tạo embedding)
          </p>
        </div>

        <!-- Output (Answer) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Câu trả lời <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.output"
            required
            rows="5"
            class="input-field"
            placeholder="VD: Để đặt lịch trên BarberGo: 1. Mở app... 2. Chọn salon... 3. Chọn dịch vụ..."
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Câu trả lời chi tiết cho câu hỏi
          </p>
        </div>

        <!-- Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Loại <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.type"
            required
            class="input-field"
          >
            <option value="" disabled>-- Chọn loại --</option>
            <option value="app">App (Chức năng ứng dụng)</option>
            <option value="beauty">Beauty (Làm đẹp, chăm sóc)</option>
            <option value="policy">Policy (Chính sách, điều khoản)</option>
            <option value="general">General (Chung chung)</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            Phân loại document để dễ quản lý
          </p>
        </div>

        <!-- Preview Type Info -->
        <div v-if="form.type" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm text-blue-800">
            <strong>📌 {{ getTypeLabel(form.type) }}:</strong>
            {{ getTypeDescription(form.type) }}
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✅ {{ isEdit ? 'Document đã được cập nhật!' : 'Document đã được tạo!' }}
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 btn-secondary"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 btn-primary disabled:opacity-50"
          >
            {{ isLoading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo mới') }}
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
  type: 'general'  // Default type
})

// Load existing data if editing
watch(() => props.document, (newDoc) => {
  if (newDoc) {
    form.value = {
      content: newDoc.content || '',
      output: newDoc.metadata?.output || '',
      type: newDoc.metadata?.type || 'general'
    }
  }
}, { immediate: true })

// Helper functions for type descriptions
const getTypeLabel = (type) => {
  const labels = {
    app: 'Chức năng App',
    beauty: 'Làm đẹp',
    policy: 'Chính sách',
    general: 'Chung chung'
  }
  return labels[type] || type
}

const getTypeDescription = (type) => {
  const descriptions = {
    app: 'Câu hỏi về tính năng, cách sử dụng app (đặt lịch, hủy lịch, thanh toán...)',
    beauty: 'Câu hỏi về làm đẹp, chăm sóc (cắt tóc, nhuộm, spa...)',
    policy: 'Câu hỏi về chính sách, điều khoản, quy định',
    general: 'Các câu hỏi khác không thuộc các loại trên'
  }
  return descriptions[type] || ''
}

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  isLoading.value = true

  try {
    if (isEdit.value) {
      // ✅ Update existing document
      await ragService.updateDocument(props.document.id, {
        new_content: form.value.content,
        new_output: form.value.output,
        new_metadata: { type: form.value.type }
      })
    } else {
      // ✅ Create new document
      await ragService.createDocument({
        content: form.value.content,
        output: form.value.output,
        type: form.value.type
      })
    }

    success.value = true
    setTimeout(() => {
      emit('success')
    }, 1000)

  } catch (err) {
    console.error('Save document error:', err)
    error.value = err.response?.data?.detail || 'Không thể lưu document'
  } finally {
    isLoading.value = false
  }
}
</script>