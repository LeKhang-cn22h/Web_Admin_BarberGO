<!-- src/components/BarberFormModal.vue -->
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
          <div class="flex items-center gap-4">
            <div class="relative">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Xem trước"
                class="w-24 h-24 rounded-full object-cover"
              />
              <div v-else class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon class="w-12 h-12 text-gray-400" />
              </div>
              <label class="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                <CameraIcon class="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageChange"
                />
              </label>
            </div>
              <div class="flex-1">
              <p class="text-sm text-gray-600">Tải ảnh đại diện</p>
              <p class="text-xs text-gray-500 mt-1">JPG, PNG hoặc WEBP. Tối đa 5MB.</p>
            </div>
          </div>
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tên thợ cắt tóc <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="input-field"
            placeholder="Nhập tên thợ"
          />
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
          <textarea
            v-model="form.address"
            rows="3"
            class="input-field"
            placeholder="Nhập địa chỉ đầy đủ"
          ></textarea>
        </div>

        <!-- Area -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Khu vực/Quận</label>
          <input
            v-model="form.area"
            type="text"
            class="input-field"
            placeholder="e.g., Quận 1, Quận 2"
          />
        </div>

        <!-- Location Coordinates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vĩ độ</label>
            <input
              v-model.number="form.location.lat"
              type="number"
              step="any"
              class="input-field"
              placeholder="10.762622"
            />
          </div>
          <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kinh độ</label>
            <input
              v-model.number="form.location.lng"
              type="number"
              step="any"
              class="input-field"
              placeholder="106.660172"
            />
          </div>
        </div>

        <!-- Working Hours -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Giờ mở cửa</label>
            <input
              v-model="form.opening_time"
              type="time"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Giờ đóng cửa</label>
            <input
              v-model="form.closing_time"
              type="time"
              class="input-field"
            />
          </div>
        </div>

        <!-- Working Days -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ngày làm việc</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="day in daysOfWeek"
              :key="day.value"
              class="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
              :class="form.working_days.includes(day.value) ? 'bg-blue-50 border-blue-500' : 'border-gray-300'"
            >
              <input
                type="checkbox"
                :value="day.value"
                v-model="form.working_days"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm">{{ day.label }}</span>
            </label>
          </div>
        </div>

        <!-- Status -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium text-gray-800">Trạng thái hoạt động</p>
            <p class="text-sm text-gray-600">Thợ sẽ hiển thị với khách hàng</p>
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
            {{ isLoading ? 'Đang lưu...' : (isEdit ? 'Cập nhật thợ' : 'Tạo thợ') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import barberService from '@/api/services/barberService'
import {
  XMarkIcon,
  UserIcon,
  CameraIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  barber: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()

const isEdit = computed(() => !!props.barber)
const isLoading = ref(false)
const error = ref('')
const imageFile = ref(null)
const imagePreview = ref(props.barber?.imagepath || '')

const daysOfWeek = [
  { label: 'Thứ Hai', value: 'Monday' },
  { label: 'Thứ Ba', value: 'Tuesday' },
  { label: 'Thứ Tư', value: 'Wednesday' },
  { label: 'Thứ Năm', value: 'Thursday' },
  { label: 'Thứ Sáu', value: 'Friday' },
  { label: 'Thứ Bảy', value: 'Saturday' },
  { label: 'Chủ Nhật', value: 'Sunday' }
]

const form = ref({
  name: '',
  address: '',
  area: '',
  location: {
    lat: null,
    lng: null
  },
  opening_time: '',
  closing_time: '',
  working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  status: true
})

// Load existing data if editing
watch(() => props.barber, (newBarber) => {
  if (newBarber) {
    form.value = {
      name: newBarber.name || '',
      address: newBarber.address || '',
      area: newBarber.area || '',
      location: newBarber.location || { lat: null, lng: null },
      opening_time: newBarber.opening_time || '',
      closing_time: newBarber.closing_time || '',
      working_days: newBarber.working_days || [],
      status: newBarber.status ?? true
    }
    imagePreview.value = newBarber.imagepath || ''
  }
}, { immediate: true })

const handleImageChange = (e) => {
  const file = e.target.files[0]
    if (file) {
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'Kích thước ảnh phải nhỏ hơn 5MB'
      return
    }
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true

  try {
    if (isEdit.value) {
      // Update existing barber
      await barberService.update(props.barber.id, form.value)
      
      // Upload image if changed
      if (imageFile.value) {
        await barberService.uploadImage(props.barber.id, imageFile.value)
      }
    } else {
      // Create new barber
      const response = await barberService.create({
        ...form.value,
        user_id: authStore.user.id
      })

      // Upload image
      if (imageFile.value && response.data?.id) {
        await barberService.uploadImage(response.data.id, imageFile.value)
      }
    }

    emit('success')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Lưu thợ thất bại'
  } finally {
    isLoading.value = false
  }
}
</script>