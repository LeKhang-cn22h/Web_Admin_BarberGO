<!-- src/components/common/ImageUpload.vue -->
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
    <div class="flex items-center gap-4">
      <div class="relative">
        <img
          v-if="previewUrl"
          :src="previewUrl"
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
            @change="handleChange"
          />
        </label>
      </div>
      <div class="flex-1">
        <p class="text-sm text-gray-600">Tải ảnh đại diện</p>
        <p class="text-xs text-gray-500 mt-1">JPG, PNG hoặc WEBP. Tối đa 5MB.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, CameraIcon } from '@heroicons/vue/24/outline'
import { IMAGE_UPLOAD_CONFIG } from '@/constants/barbers.contans'

defineProps({
  previewUrl: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change', 'error'])

const handleChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Validate file size
  if (file.size > IMAGE_UPLOAD_CONFIG.MAX_SIZE) {
    emit('error', `Kích thước ảnh phải nhỏ hơn ${IMAGE_UPLOAD_CONFIG.MAX_SIZE / (1024 * 1024)}MB`)
    return
  }

  // Validate file type
  if (!IMAGE_UPLOAD_CONFIG.ACCEPTED_TYPES.includes(file.type)) {
    emit('error', 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WEBP')
    return
  }

  emit('change', file)
  emit('error', null)
}
</script>