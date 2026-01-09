<!-- src/components/appointments/CreateOwnerModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="handleClose">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-gray-800">Tạo tài khoản Owner</h3>
          <p class="text-sm text-gray-600 mt-1">Hệ thống tự động tạo email & mật khẩu</p>
        </div>
        <button @click="handleClose" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Preview Info -->
      <div class="px-6 pt-6">
        <div class="bg-blue-50 rounded-lg p-4">
          <h4 class="font-semibold text-blue-900 mb-3">📋 Thông tin Appointment</h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-600">Khách hàng:</span>
              <span class="ml-2 font-medium">{{ appointment.users?.full_name }}</span>
            </div>
            <div>
              <span class="text-gray-600">Email gốc:</span>
              <span class="ml-2 font-medium">{{ appointment.email }}</span>
            </div>
            <div>
              <span class="text-gray-600">SĐT:</span>
              <span class="ml-2 font-medium">{{ appointment.phone }}</span>
            </div>
            <div>
              <span class="text-gray-600">Tên tiệm:</span>
              <span class="ml-2 font-medium">{{ appointment.name_barber }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto-generated Credentials -->
      <div class="px-6 pt-4">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 class="font-semibold text-purple-900 mb-3"> Thông tin đăng nhập (Tự động)</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center p-2 bg-white rounded">
              <span class="text-gray-600">Email:</span>
              <div class="flex items-center gap-2">
                <code class="text-purple-900 font-mono text-xs">{{ ownerEmail }}</code>
                
              </div>
            </div>
              <div class="flex justify-between items-center p-2 bg-white rounded">
                <span class="text-gray-600">Mật khẩu:</span>
                <div class="flex items-center gap-2">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    :value="generatedPassword"
                    readonly
                    class="text-purple-900 font-mono text-xs bg-transparent border-none outline-none w-40"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="text-gray-500 hover:text-gray-700 px-2"
                    :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                  >
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.96 9.96 0 012.223-3.445M3 3l18 18" />
                    </svg>
                  </button>
                  <button type="button" @click="copyToClipboard(generatedPassword)" class="text-sm text-gray-500 hover:text-gray-700 px-2">
                    Copy
                  </button>
                </div>
              </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.full_name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.phone"
            type="tel"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Warning -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <span class="text-2xl">⚠️</span>
            <div class="text-sm text-yellow-800">
              <p class="font-semibold">Sau khi tạo thành công:</p>
              <p>• Gmail/Outlook sẽ tự động mở</p>
              <p>• Email đã điền sẵn nội dung</p>
              <p>• Bạn chỉ cần click "Gửi"</p>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t">
          <button
            type="button"
            @click="handleClose"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {{ isSubmitting ? 'Đang xử lý...' : 'Tạo Owner & Gửi Email' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { generateSecurePassword, transformToOwnerEmail } from '@/utils/password'

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const isSubmitting = ref(false)
const error = ref('')

// Auto-generate credentials
const ownerEmail = computed(() => transformToOwnerEmail(props.appointment.email))
const generatedPassword = ref('')
const showPassword = ref(false)

const form = ref({
  full_name: '',
  phone: ''
})

// Auto-fill
watch(() => props.appointment, (apt) => {
  if (apt) {
    form.value.full_name = apt.users?.full_name || ''
    form.value.phone = apt.phone || ''
    
    if (!generatedPassword.value) {
      generatedPassword.value = generateSecurePassword(12)
    }
  }
}, { immediate: true })



const openEmailClient = () => {
  const subject = encodeURIComponent('🔐 Thông tin tài khoản Owner - Barber System')
  
  const emailBody = `Xin chào ${form.value.full_name},

Chúc mừng! Tài khoản Owner cho tiệm "${props.appointment.name_barber}" đã được tạo thành công.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 THÔNG TIN ĐĂNG NHẬP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email: ${ownerEmail.value}
🔑 Mật khẩu: ${generatedPassword.value}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ LƯU Ý BẢO MẬT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Vui lòng ĐỔI MẬT KHẨU sau lần đăng nhập đầu tiên
• KHÔNG chia sẻ thông tin này với người khác
• Lưu mật khẩu ở nơi an toàn

🔗 Đăng nhập tại: ${window.location.origin}/login

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nếu cần hỗ trợ, vui lòng liên hệ:
📞 Hotline: 1900-xxxx
📧 Email: support@barbersystem.com

Trân trọng,
Barber System Team`

  const body = encodeURIComponent(emailBody)
  const mailtoLink = `mailto:${props.appointment.email}?subject=${subject}&body=${body}`
  
  console.log('Opening email client...')
  window.location.href = mailtoLink
}

const handleSubmit = async () => {
  error.value = ''
  isSubmitting.value = true

  try {
    const ownerData = {
      email: ownerEmail.value,
      full_name: form.value.full_name,
      phone: form.value.phone,
      password: generatedPassword.value
    }

    const barberData = {
      name: props.appointment.name_barber || '',
      address: props.appointment.address || '',
      area: props.appointment.area || '',
      location: props.appointment.location || { lat: null, lng: null },
      opening_time: '08:00',
      closing_time: '20:00',
      working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      status: true
    }

    // Emit data to parent
    emit('success', {
      ownerData,
      barberData,
      openEmailClient // Pass function to parent
    })
    
  } catch (err) {
    error.value = err.message || 'Có lỗi xảy ra'
    isSubmitting.value = false
  }
}

const handleClose = () => {
  if (isSubmitting.value) return
  if (confirm('Bạn có chắc muốn hủy?')) {
    emit('close')
  }
}
</script>