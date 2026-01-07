<!-- src/components/appointments/ConfirmBarberCreationModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4">
        <h3 class="text-xl font-bold text-gray-800">
          Xác nhận tạo thợ cắt tóc
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          Kiểm tra và chỉnh sửa thông tin trước khi tạo
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleConfirm" class="p-6 space-y-6">
        <!-- Appointment Info (Read-only) -->
        <div class="bg-blue-50 rounded-lg p-4 space-y-2">
          <h4 class="font-semibold text-blue-900">Thông tin lịch hẹn</h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-600">Khách hàng:</span>
              <span class="ml-2 font-medium">{{ appointment.users?.full_name }}</span>
            </div>
            <div>
              <span class="text-gray-600">SĐT:</span>
              <span class="ml-2 font-medium">{{ appointment.phone }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-gray-600">Email:</span>
              <span class="ml-2 font-medium">{{ appointment.email }}</span>
            </div>
          </div>
        </div>

        <!-- Barber Form Fields -->
        <FormField label="User ID" required>
          <input
            v-model="form.user_id"
            type="text"
            required
            class="input-field bg-gray-100"
            readonly
          />
        </FormField>

        <FormField label="Tên thợ cắt tóc" required>
          <input
            v-model="form.name"
            type="text"
            required
            class="input-field"
            placeholder="Nhập tên thợ"
          />
        </FormField>

        <FormField label="Địa chỉ">
          <textarea
            v-model="form.address"
            rows="3"
            class="input-field"
            placeholder="Nhập địa chỉ đầy đủ"
          ></textarea>
        </FormField>

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
        <FormField label="Ngày làm việc">
          <div class="grid grid-cols-2 gap-2 mt-2">
            <label
              v-for="day in DAYS_OF_WEEK"
              :key="day.value"
              class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="day.value"
                v-model="form.working_days"
                class="rounded"
              />
              <span class="text-sm">{{ day.label }}</span>
            </label>
          </div>
        </FormField>

        <!-- Status -->
        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="barber-status"
            v-model="form.status"
            class="w-5 h-5 rounded"
          />
          <label for="barber-status" class="flex-1 cursor-pointer">
            <div class="font-medium">Kích hoạt ngay</div>
            <div class="text-sm text-gray-600">Thợ sẽ hiển thị với khách hàng</div>
          </label>
        </div>

        <!-- Error Message -->
        <ErrorAlert v-if="error" :message="error" />

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('cancel')"
            class="flex-1 btn-secondary"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isProcessing"
            class="flex-1 btn-primary disabled:opacity-50"
          >
            {{ isProcessing ? 'Đang xử lý...' : 'Xác nhận & Tạo thợ' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DEFAULT_WORKING_DAYS, DAYS_OF_WEEK } from '@/constants/barbers.contans'
import FormField from '@/components/common/FormField.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const error = ref('')

// Tự động điền form từ thông tin appointment
const form = ref({
  user_id: props.appointment.user_id || '', // Lấy user_id từ appointment (người đặt lịch)
  name: props.appointment.name_barber || props.appointment.users?.full_name || 'Thợ cắt tóc',
  address: props.appointment.address || '',
  area: props.appointment.area || '',
  location: {
    lat: props.appointment.location?.lat || null,
    lng: props.appointment.location?.lng || null
  },
  opening_time: '08:00',
  closing_time: '20:00',
  working_days: DEFAULT_WORKING_DAYS,
  status: true
})

const handleConfirm = () => {
  error.value = ''

  // Validate
  if (!form.value.user_id) {
    error.value = 'User ID là bắt buộc'
    return
  }

  if (!form.value.name.trim()) {
    error.value = 'Tên thợ là bắt buộc'
    return
  }

  // Debug log
  console.log('=== Creating Barber ===')
  console.log('Appointment user_id:', props.appointment.user_id)
  console.log('Form user_id:', form.value.user_id)
  console.log('Barber will be owned by User ID:', form.value.user_id)
  console.log('=======================')

  emit('confirm', form.value)
}
</script>