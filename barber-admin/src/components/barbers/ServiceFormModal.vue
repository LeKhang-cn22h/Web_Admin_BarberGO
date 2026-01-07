<!-- src/components/barbers/ServiceFormModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <h3 class="text-xl font-bold text-white">
          {{ isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới' }}
        </h3>
        <button @click="$emit('close')" class="text-white hover:text-gray-200">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
        <!-- Service Name -->
        <FormField label="Tên dịch vụ" required>
          <input
            v-model="form.service_name"
            type="text"
            required
            class="input-field"
            placeholder="VD: Cắt tóc cổ điển"
          />
        </FormField>

        <!-- Price -->
        <FormField label="Giá (VND)" required>
          <div class="relative">
            <input
              v-model.number="form.price"
              type="number"
              required
              min="0"
              step="1000"
              class="input-field pr-12"
              placeholder="100000"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">đ</span>
          </div>
        </FormField>

        <!-- Duration -->
        <FormField label="Thời lượng (phút)" required>
          <select v-model.number="form.duration_min" required class="input-field">
            <option
              v-for="option in durationOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </FormField>

        <!-- Status -->
        <StatusToggle
          v-model="form.status"
          label="Trạng thái hoạt động"
          description="Dịch vụ sẽ hiển thị với khách hàng"
        />

        <!-- Error Message -->
        <ErrorAlert v-if="error" :message="error" />

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 btn-secondary"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isProcessing"
            class="flex-1 btn-primary disabled:opacity-50"
          >
            {{ isProcessing ? 'Đang lưu...' : (isEdit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useServices } from '@/composables/useServices'
import { SERVICE_DURATION_OPTIONS } from '@/constants/barbers.contans'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import FormField from '@/components/common/FormField.vue'
import StatusToggle from '@/components/common/StatusToggle.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'

const props = defineProps({
  barberId: {
    type: String,
    required: true
  },
  service: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const { createService, updateService, isProcessing } = useServices(props.barberId)

const isEdit = computed(() => !!props.service)
const error = ref('')
const durationOptions = SERVICE_DURATION_OPTIONS

const form = ref({
  service_name: '',
  price: 0,
  duration_min: 30,
  status: true
})

watch(() => props.service, (newService) => {
  if (newService) {
    form.value = {
      service_name: newService.service_name || '',
      price: newService.price || 0,
      duration_min: newService.duration_min || 30,
      status: newService.status ?? true
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  error.value = ''

  try {
    if (isEdit.value) {
      await updateService(props.service.id, form.value)
    } else {
      await createService(form.value)
    }

    emit('success')
  } catch (err) {
    error.value = err.message || 'Lưu dịch vụ thất bại'
  }
}
</script>