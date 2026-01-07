<!-- src/components/barbers/BarberFormModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-800">
          {{ isEdit ? 'Chỉnh sửa thợ cắt tóc' : 'Thêm thợ cắt tóc mới' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Image Upload -->
        <ImageUpload
          :preview-url="imagePreview"
          @change="handleImageChange"
          @error="error = $event"
        />
        <FormField label="ID Chủ sở hữu (User ID)" required>
          <input
            v-model="form.user_id"
            type="text"
            required
            class="input-field"
            placeholder="Nhập ID của User quản lý"
          />
        </FormField>
        <!-- Name -->
        <FormField label="Tên thợ cắt tóc" required>
          <input
            v-model="form.name"
            type="text"
            required
            class="input-field"
            placeholder="Nhập tên thợ"
          />
        </FormField>

        <!-- Address -->
        <FormField label="Địa chỉ">
          <textarea
            v-model="form.address"
            rows="3"
            class="input-field"
            placeholder="Nhập địa chỉ đầy đủ"
          ></textarea>
        </FormField>

        <!-- Area -->
        <FormField label="Khu vực/Quận">
          <input
            v-model="form.area"
            type="text"
            class="input-field"
            placeholder="e.g., Quận 1, Quận 2"
          />
        </FormField>

        <!-- Location Coordinates -->
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Vĩ độ">
            <input
              v-model.number="form.location.lat"
              type="number"
              step="any"
              class="input-field"
              placeholder="10.762622"
            />
          </FormField>
          <FormField label="Kinh độ">
            <input
              v-model.number="form.location.lng"
              type="number"
              step="any"
              class="input-field"
              placeholder="106.660172"
            />
          </FormField>
        </div>

        <!-- Working Hours -->
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Giờ mở cửa">
            <input
              v-model="form.opening_time"
              type="time"
              class="input-field"
            />
          </FormField>
          <FormField label="Giờ đóng cửa">
            <input
              v-model="form.closing_time"
              type="time"
              class="input-field"
            />
          </FormField>
        </div>

        <!-- Working Days -->
        <WorkingDaysSelector
          v-model="form.working_days"
        />

        <!-- Status Toggle -->
          <StatusToggle
      v-model="form.status"
      label="Trạng thái hoạt động"
      description="Thợ sẽ hiển thị với khách hàng"
    />

    <!-- Error Message -->
    <ErrorAlert v-if="error" :message="error" />

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
        :disabled="isProcessing"
        class="flex-1 btn-primary disabled:opacity-50"
      >
        {{ isProcessing ? 'Đang lưu...' : (isEdit ? 'Cập nhật thợ' : 'Tạo thợ') }}
      </button>
    </div>
  </form>
</div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBarbers } from '@/composables/useBarbers'
import { DEFAULT_WORKING_DAYS } from '@/constants/barbers.contans'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import ImageUpload from '@/components/common/ImageUpload.vue'
import FormField from '@/components/common/FormField.vue'
import WorkingDaysSelector from '@/components/barbers/WorkingDaysSelector.vue'
import StatusToggle from '@/components/common/StatusToggle.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'

const props = defineProps({
  barber: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const { createBarber, updateBarber, isProcessing } = useBarbers()

const isEdit = computed(() => !!props.barber)
const error = ref('')
const imageFile = ref(null)
const imagePreview = ref(props.barber?.imagepath || '')

const form = ref({
  user_id:'',
  name: '',
  address: '',
  area: '',
  location: {
    lat: null,
    lng: null
  },
  opening_time: '',
  closing_time: '',
  working_days: DEFAULT_WORKING_DAYS,
  status: true
})

// Load existing data if editing
watch(() => props.barber, (newBarber) => {
  if (newBarber) {
    form.value = {
      user_id: newBarber.user_id || '',
      name: newBarber.name || '',
      address: newBarber.address || '',
      area: newBarber.area || '',
      location: newBarber.location || { lat: null, lng: null },
      opening_time: newBarber.opening_time || '',
      closing_time: newBarber.closing_time || '',
      working_days: newBarber.working_days || DEFAULT_WORKING_DAYS,
      status: newBarber.status ?? true
    }
    imagePreview.value = newBarber.imagepath || ''
  }
}, { immediate: true })

const handleImageChange = (file) => {
  imageFile.value = file
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  error.value = ''

  try {
    // Validate cơ bản
    if (!form.value.user_id) {
        error.value = 'Vui lòng nhập User ID'
        return
    }
    if (isEdit.value) {
      await updateBarber(props.barber.id, form.value, imageFile.value)
    } else {
      await createBarber({
        ...form.value,
        user_id: form.value.user_id
      }, imageFile.value)
    }

    emit('success')
  } catch (err) {
    error.value = err.message || 'Lưu thợ thất bại'
  }
}
</script>