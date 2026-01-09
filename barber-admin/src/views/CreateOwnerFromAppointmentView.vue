src/views/CreateOwnerFromAppointmentView.vue
<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="card">
      <div class="flex items-center gap-4">
        <button 
          @click="goBack"
          class="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Tạo tài khoản Owner</h2>
          <p class="text-gray-600 mt-1">Tạo tài khoản owner từ thông tin appointment</p>
        </div>
      </div>
    </div>

    <!-- Appointment Info Preview -->
    <div class="card bg-blue-50 border border-blue-200">
      <h3 class="font-semibold text-blue-900 mb-4">📋 Thông tin từ Appointment</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-600">Tên khách hàng:</span>
          <span class="ml-2 font-medium">{{ appointmentData?.users?.full_name }}</span>
        </div>
        <div>
          <span class="text-gray-600">Email:</span>
          <span class="ml-2 font-medium">{{ appointmentData?.email }}</span>
        </div>
        <div>
          <span class="text-gray-600">Số điện thoại:</span>
          <span class="ml-2 font-medium">{{ appointmentData?.phone }}</span>
        </div>
        <div>
          <span class="text-gray-600">Tên tiệm:</span>
          <span class="ml-2 font-medium">{{ appointmentData?.name_barber }}</span>
        </div>
      </div>
    </div>

    <!-- Owner Creation Form -->
    <div class="card">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Thông tin tài khoản Owner</h3>
      
      <form @submit.prevent="handleCreateOwner" class="space-y-6">
        <!-- Email -->
        <FormField label="Email" required>
          <input
            v-model="ownerForm.email"
            type="email"
            required
            class="input-field"
            placeholder="email@example.com"
          />
        </FormField>

        <!-- Full Name -->
        <FormField label="Họ và tên" required>
          <input
            v-model="ownerForm.full_name"
            type="text"
            required
            class="input-field"
            placeholder="Nguyễn Văn A"
          />
        </FormField>

        <!-- Phone -->
        <FormField label="Số điện thoại" required>
          <input
            v-model="ownerForm.phone"
            type="tel"
            required
            class="input-field"
            placeholder="0912345678"
          />
        </FormField>

        <!-- Password -->
        <FormField label="Mật khẩu" required>
          <input
            v-model="ownerForm.password"
            type="password"
            required
            minlength="6"
            class="input-field"
            placeholder="Tối thiểu 6 ký tự"
          />
          <p class="text-xs text-gray-500 mt-1">
            Mật khẩu mặc định cho tài khoản owner
          </p>
        </FormField>

        <!-- Info Box -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm text-yellow-800">
              <p class="font-semibold">Lưu ý quan trọng:</p>
              <ul class="list-disc list-inside mt-2 space-y-1">
                <li>Tài khoản sẽ có role <strong>Owner</strong></li>
                <li>Email sẽ được tự động xác nhận</li>
                <li>Sau khi tạo, hệ thống sẽ tự động tạo tiệm cắt tóc</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Error Alert -->
        <ErrorAlert v-if="error" :message="error" />

        <!-- Actions -->
        <div class="flex gap-4 pt-4 border-t">
          <button
            type="button"
            @click="goBack"
            class="flex-1 btn-secondary"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isProcessing"
            class="flex-1 btn-primary"
          >
            {{ isProcessing ? 'Đang tạo...' : 'Tạo Owner & Tiệm' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '@/composables/useNotification'
import { useBarberStore } from '@/stores/barber'
import { useAppointmentStore } from '@/stores/appointment'
import apiClient from '@/api/axios'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import FormField from '@/components/common/FormField.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'

const route = useRoute()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const barberStore = useBarberStore()
const appointmentStore = useAppointmentStore()

const isProcessing = ref(false)
const error = ref('')
const appointmentData = ref(null)

// Owner form
const ownerForm = ref({
  email: '',
  full_name: '',
  phone: '',
  password: 'Owner123456' // Mật khẩu mặc định
})

// Barber data sẽ được tạo sau khi có owner ID
const barberData = ref({
  name: '',
  address: '',
  area: '',
  location: {
    lat: null,
    lng: null
  },
  opening_time: '08:00',
  closing_time: '20:00',
  working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  status: true
})

onMounted(() => {
  // Lấy data từ route params hoặc localStorage
  const appointmentId = route.params.appointmentId
  
  if (appointmentId) {
    loadAppointmentData(appointmentId)
  } else {
    // Fallback: lấy từ localStorage nếu có
    const savedData = localStorage.getItem('pendingOwnerCreation')
    if (savedData) {
      const data = JSON.parse(savedData)
      appointmentData.value = data.appointment
      prefillForms(data.appointment)
    } else {
      showError('Không tìm thấy thông tin appointment')
      router.push('/appointments')
    }
  }
})

const loadAppointmentData = async (appointmentId) => {
  try {
    const appointment = await appointmentStore.fetchById(appointmentId)
    appointmentData.value = appointment
    prefillForms(appointment)
  } catch (err) {
    showError('Không thể tải thông tin appointment')
    router.push('/appointments')
  }
}

const prefillForms = (appointment) => {
  // Prefill owner form
  ownerForm.value.email = appointment.email || ''
  ownerForm.value.full_name = appointment.users?.full_name || ''
  ownerForm.value.phone = appointment.phone || ''

  // Prefill barber form
  barberData.value.name = appointment.name_barber || ''
  barberData.value.address = appointment.address || ''
  barberData.value.area = appointment.area || ''
  barberData.value.location = appointment.location || { lat: null, lng: null }
}

const handleCreateOwner = async () => {
  error.value = ''
  isProcessing.value = true

  try {
    // 1. Tạo tài khoản Owner
    console.log('Creating owner account...', ownerForm.value)
    const ownerResponse = await apiClient.post('/users/create-owner', ownerForm.value)
    
    const newOwnerId = ownerResponse.data.user.id
    console.log('Owner created with ID:', newOwnerId)

    // 2. Xác nhận appointment với admin ID hiện tại
    console.log('Confirming appointment...')
    const adminId = localStorage.getItem('currentUserId') // Hoặc lấy từ auth store
    await appointmentStore.confirmAppointment(
      appointmentData.value.id,
      adminId,
      'Đã tạo owner và xác nhận'
    )

    // 3. Tạo barber với owner ID mới
    console.log('Creating barber for owner:', newOwnerId)
    barberData.value.user_id = newOwnerId // ← Dùng owner ID mới
    
    const newBarber = await barberStore.createBarber(barberData.value)
    console.log('Barber created:', newBarber)

    // 4. Xóa data tạm từ localStorage
    localStorage.removeItem('pendingOwnerCreation')

    // 5. Thông báo thành công
    showSuccess(`
      ✓ Tạo tài khoản Owner thành công
      ✓ Tạo tiệm "${newBarber.name}" thành công
      ✓ Xác nhận appointment thành công
    `)

    // 6. Chuyển về trang appointments
    setTimeout(() => {
      router.push('/appointments')
    }, 1500)

  } catch (err) {
    console.error('Error creating owner:', err)
    error.value = err.response?.data?.detail || err.message || 'Có lỗi xảy ra'
  } finally {
    isProcessing.value = false
  }
}

const goBack = () => {
  if (confirm('Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.')) {
    localStorage.removeItem('pendingOwnerCreation')
    router.push('/appointments')
  }
}
</script>