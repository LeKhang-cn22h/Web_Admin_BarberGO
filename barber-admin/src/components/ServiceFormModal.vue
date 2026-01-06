<!-- src/components/ServiceFormModal.vue -->
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tên dịch vụ <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.service_name"
            type="text"
            required
            class="input-field"
            placeholder="VD: Cắt tóc cổ điển"
          />
        </div>

        <!-- Price -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Giá (VND) <span class="text-red-500">*</span>
          </label>
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
        </div>

        <!-- Duration -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Thời lượng (phút) <span class="text-red-500">*</span>
          </label>
          <select v-model.number="form.duration_min" required class="input-field">
            <option :value="15">15 phút</option>
            <option :value="30">30 phút</option>
            <option :value="45">45 phút</option>
            <option :value="60">1 giờ</option>
            <option :value="90">1.5 giờ</option>
            <option :value="120">2 giờ</option>
          </select>
        </div>

        <!-- Status -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium text-gray-800">Trạng thái hoạt động</p>
            <p class="text-sm text-gray-600">Dịch vụ sẽ hiển thị với khách hàng</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="form.status"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

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
            :disabled="isLoading"
            class="flex-1 btn-primary disabled:opacity-50"
          >
            {{ isLoading ? 'Đang lưu...' : (isEdit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import apiClient from '@/api/axios'
import { XMarkIcon } from '@heroicons/vue/24/outline'

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

const isEdit = computed(() => !!props.service)
const isLoading = ref(false)
const error = ref('')

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
  isLoading.value = true

  try {
    if (isEdit.value) {
      await apiClient.put(`/services/${props.service.id}`, form.value)
    } else {
      await apiClient.post('/services/', {
        ...form.value,
        barber_id: props.barberId
      })
    }

    emit('success')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Lưu dịch vụ thất bại'
  } finally {
    isLoading.value = false
  }
}
</script>