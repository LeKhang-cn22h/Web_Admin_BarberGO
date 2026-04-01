<!-- src/views/DashboardView.vue -->
<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">Chào mừng trở lại, {{ userName }}!</h1>
          <p class="text-blue-100">Đây là những gì đang xảy ra với tiệm cắt tóc của bạn hôm nay.</p>
        </div>
        <CalendarDaysIcon class="w-20 h-20 opacity-20" />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="card hover:shadow-lg transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">{{ stat.label }}</p>
            <p class="text-3xl font-bold" :class="stat.color">{{ stat.value }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stat.change }}</p>
          </div>
          <div :class="`bg-${stat.iconBg}-100 p-4 rounded-full`">
            <component :is="stat.icon" :class="`w-8 h-8 text-${stat.iconBg}-600`" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Pending Appointments -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-800">Cuộc hẹn chờ xử lý</h3>
          <router-link to="/appointments" class="text-orange-600 text-sm hover:text-orange-700">
            Xem tất cả →
          </router-link>
        </div>

        <div v-if="loadingAppointments" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="appointment in pendingAppointments"
            :key="appointment.id"
            class="p-4 border border-orange-200 bg-orange-50 rounded-lg"
          >
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="font-medium text-gray-800">{{ appointment.users?.full_name }}</p>
                <p class="text-sm text-gray-600">{{ appointment.name_barber }}</p>
              </div>
              <ClockIcon class="w-5 h-5 text-orange-600" />
            </div>
            <div class="flex gap-2 mt-3">
              <button
                @click="handleConfirm(appointment)"
                :disabled="isProcessing"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition disabled:opacity-50"
              >
                {{ isProcessing ? 'Đang xử lý...' : 'Xác nhận' }}
              </button>
              <button
                @click="handleReject(appointment)"
                :disabled="isProcessing"
                class="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition disabled:opacity-50"
              >
                Từ chối
              </button>
            </div>
          </div>

          <div v-if="pendingAppointments.length === 0" class="text-center py-8 text-gray-500">
            Chưa có cuộc hẹn chờ xử lý
          </div>
        </div>
      </div>
    </div>

    <!-- Top Barbers -->
    <div class="card">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Thợ cắt tóc hàng đầu</h3>

      <div v-if="loadingBarbers" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="barber in topBarbers"
          :key="barber.id"
          class="p-6 border border-gray-200 rounded-lg hover:shadow-md transition"
        >
          <div class="flex items-center gap-4 mb-4">
            <img
              v-if="barber.imagepath"
              :src="barber.imagepath"
              :alt="barber.name"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div v-else class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon class="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h4 class="font-bold text-gray-800">{{ barber.name }}</h4>
              <div class="flex items-center gap-1 mt-1">
                <StarIcon class="w-4 h-4 text-yellow-500" />
                <span class="text-sm text-gray-600">{{ barber.rank || 0 }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Trạng thái:</span>
            <span :class="barber.status ? 'text-green-600' : 'text-red-600'">
              {{ barber.status ? 'Hoạt động' : 'Không hoạt động' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Barber Creation Modal -->
    <ConfirmBarberCreationModal
      v-if="showConfirmModal && selectedAppointment"
      :appointment="selectedAppointment"
      :is-processing="isProcessing"
      @confirm="handleConfirmWithBarber"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBarberStore } from '@/stores/barber'
import appointmentService from '@/api/services/appointmentService'
import barberService from '@/api/services/barberService'
import { emailApi } from '@/api/emailApi'
import { useNotification } from '@/composables/useNotification'
import { generateSecurePassword, transformToOwnerEmail } from '@/utils/password'

import ConfirmBarberCreationModal from '@/components/appointment/ConfirmBarberCreationModal.vue'
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  StarIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const barberStore = useBarberStore()
const { showSuccess, showError } = useNotification()

const userName = computed(() => authStore.user?.full_name || 'Admin')

const loadingAppointments = ref(false)
const loadingBarbers = ref(false)
const isProcessing = ref(false)

const pendingAppointments = ref([])
const topBarbers = ref([])
const stats = ref([
  {
    label: 'Tổng cuộc hẹn',
    value: '0',
    change:'Tất cả cuộc hẹn',
    color: 'text-blue-600',
    icon: CalendarDaysIcon,
    iconBg: 'blue'
  },
  {
    label: 'Thợ cắt tóc',
    value: '0',
    change:'Đang hoạt động',
    color: 'text-green-600',
    icon: UserIcon,
    iconBg: 'green'
  },
  {
    label: 'Chờ xử lý',
    value: '0',
    change: 'Cần xem xét',
    color: 'text-orange-600',
    icon: ClockIcon,
    iconBg: 'orange'
  },
])

// Modal state
const showConfirmModal = ref(false)
const selectedAppointment = ref(null)
const loadingStats = ref(false)
const fetchPendingAppointments = async () => {
  loadingAppointments.value = true
  try {
    const response = await appointmentService.getByStatus('pending')
    console.log('Pending appointments response:', response)

    pendingAppointments.value = response.slice(0, 5)
    stats.value[2].value = response.length.toString()
  } catch (error) {
    console.error('Error fetching appointments:', error)
  } finally {
    loadingAppointments.value = false
  }
}
const fetchStats = async () => {
  loadingStats.value = true
  try {
    const response = await barberService.getStats()
    // Backend trả về: { total_barbers, total_appointments }
    stats.value[0].value = (response.total_appointments ?? 0).toString()
    stats.value[1].value = (response.total_barbers ?? 0).toString()
  } catch (error) {
    console.error('Error fetching stats:', error)
  } finally {
    loadingStats.value = false
  }
}

const fetchTopBarbers = async () => {
  loadingBarbers.value = true
  try {
    const response = await barberService.getTopBarbers(3)
    topBarbers.value = response
    console.log('Pending topbarber response:', response)
  } catch (error) {
    console.error('Error fetching barbers:', error)
  } finally {
    loadingBarbers.value = false
  }
}

/**
 * Mở modal xác nhận tạo barber
 */
const openConfirmModal = (appointment) => {
  selectedAppointment.value = appointment
  showConfirmModal.value = true
}

/**
 * Đóng modal
 */
const closeConfirmModal = () => {
  showConfirmModal.value = false
  selectedAppointment.value = null
}

/**
 * Xử lý xác nhận và tạo barber
 */
const handleConfirmWithBarber = async (barberData) => {
  isProcessing.value = true
  
  try {
    console.log('=== DEBUG handleConfirmWithBarber ===')
    console.log('selectedAppointment:', selectedAppointment.value)
    console.log('barberData:', barberData)
    console.log('authStore.user:', authStore.user)
    
    if (!authStore.user || !authStore.user.id) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    }
    
    const adminId = authStore.user.id

    // 1. Confirm appointment
    console.log('Step 1: Confirming appointment...')
    await appointmentService.confirm(
      selectedAppointment.value.id,
      adminId,
      'Đã xác nhận từ dashboard'
    )
    console.log('✅ Appointment confirmed')

    // 2. Create Owner
    console.log('Step 2: Creating owner...')
    const ownerEmail = transformToOwnerEmail(selectedAppointment.value.email)
    const ownerPassword = generateSecurePassword(12)
    
    console.log('Creating owner with:', {
      email: ownerEmail,
      password: ownerPassword
    })
    
    const ownerResult = await authStore.createOwner({
      email: ownerEmail,
      password: ownerPassword,
      full_name: selectedAppointment.value.users?.full_name || selectedAppointment.value.name_barber || 'Owner',
      phone: selectedAppointment.value.phone || ''
    })
    
    console.log('Owner creation result:', ownerResult)
    
    if (!ownerResult || !ownerResult.success) {
      throw new Error(ownerResult?.error || 'Không thể tạo Owner')
    }
    
    const newOwner = ownerResult.data
    
    if (!newOwner || !newOwner.id) {
      console.error('❌ Invalid owner data:', newOwner)
      throw new Error('Owner data không có ID')
    }
    
    console.log(' Owner created with ID:', newOwner.id)
    
    // 3. Create barber
    console.log('Step 3: Creating barber...')
    
    const barberPayload = {
      user_id: newOwner.id,
      name: barberData.name || selectedAppointment.value.name_barber || 'Barber Shop'
    }
    
    console.log('Creating barber with minimal payload:', JSON.stringify(barberPayload, null, 2))
    
    const newBarber = await barberStore.createBarber(barberPayload)
    
    console.log(' Barber created:', newBarber)
    
    // 4. Send email
    console.log('Step 4: Sending email...')
    await emailApi.sendOwnerCredentials({
      recipient: selectedAppointment.value.email,
      email: ownerEmail,
      password: ownerPassword
    })
    
    console.log('✅ Email sent')
    console.log('=== WORKFLOW COMPLETED ===')
    
    showSuccess(
      `✅ Thành công!\n\n` +
      `• Tạo Owner: ${ownerEmail}\n` +
      `• Owner ID: ${newOwner.id}\n` +
      `• Tạo Barber: ${newBarber.name}\n` +
      `• Email đã gửi đến: ${selectedAppointment.value.email}`
    )
    
    // 5. Refresh data
    await Promise.all([
      fetchPendingAppointments(),
      fetchTopBarbers(),
      fetchStats()
    ])
    
    closeConfirmModal()
    
  } catch (error) {
    console.error('❌ Error in handleConfirmWithBarber:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    })
    showError(error.message || 'Có lỗi xảy ra khi xác nhận')
  } finally {
    isProcessing.value = false
  }
}

/**
 * Xử lý xác nhận appointment (mở modal)
 */
const handleConfirm = (appointment) => {
  openConfirmModal(appointment)
}

/**
 * Xử lý từ chối appointment
 */
const handleReject = async (appointment) => {
  const reason = prompt('Lý do từ chối:')
  if (!reason) return

  isProcessing.value = true
  try {
    await appointmentService.cancel(appointment.id, reason)
    showSuccess('Đã từ chối cuộc hẹn')
    await fetchPendingAppointments()
  } catch (error) {
    showError('Từ chối cuộc hẹn thất bại', error.message)
  } finally {
    isProcessing.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    fetchPendingAppointments(),
    fetchTopBarbers(),
    fetchStats(),
  ])
})
</script>