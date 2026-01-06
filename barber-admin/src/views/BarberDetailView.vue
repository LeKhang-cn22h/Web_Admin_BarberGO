<!-- src/views/BarberDetailView.vue -->
<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button
      @click="$router.back()"
      class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      Quay lại Thợ cắt tóc
    </button>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Đang tải chi tiết thợ...</p>
    </div>

    <!-- Content -->
    <div v-else-if="barber" class="space-y-6">
      <!-- Header Card -->
      <div class="card">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Image -->
          <div class="relative">
            <img
              v-if="barber.imagepath"
              :src="barber.imagepath"
              :alt="barber.name"
              class="w-48 h-48 object-cover rounded-lg shadow-lg"
            />
            <div v-else class="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <UserIcon class="w-24 h-24 text-gray-400" />
            </div>

            <!-- Status Badge -->
            <div class="absolute top-3 right-3">
              <span
                :class="barber.status ? 'bg-green-500' : 'bg-red-500'"
                class="px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg"
              >
                {{ barber.status ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ barber.name }}</h1>
                <div class="flex items-center gap-2 mb-3">
                  <div class="flex items-center gap-1">
                    <StarIcon class="w-5 h-5 text-yellow-500 fill-current" />
                    <span class="font-semibold text-gray-800">{{ barber.rank || 0 }}</span>
                    <span class="text-gray-600 text-sm">/5.0</span>
                  </div>
                </div>
              </div>

              <button
                @click="showEditModal = true"
                class="btn-primary flex items-center gap-2"
              >
                <PencilSquareIcon class="w-5 h-5" />
                Chỉnh sửa
              </button>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div v-if="barber.address" class="flex items-start gap-3">
                <MapPinIcon class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-gray-600">Địa chỉ</p>
                  <p class="font-medium text-gray-800">{{ barber.address }}</p>
                </div>
              </div>

              <div v-if="barber.area" class="flex items-start gap-3">
                <BuildingStorefrontIcon class="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p class="text-gray-600">Khu vực</p>
                  <p class="font-medium text-gray-800">{{ barber.area }}</p>
                </div>
              </div>

              <div v-if="barber.opening_time && barber.closing_time" class="flex items-start gap-3">
                <ClockIcon class="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p class="text-gray-600">Giờ làm việc</p>
                  <p class="font-medium text-gray-800">{{ barber.opening_time }} - {{ barber.closing_time }}</p>
                </div>
              </div>

              <div v-if="barber.working_days && barber.working_days.length > 0" class="flex items-start gap-3">
                <CalendarDaysIcon class="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p class="text-gray-600">Ngày làm việc</p>
                  <p class="font-medium text-gray-800">{{ barber.working_days.join(', ') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card bg-blue-50 border border-blue-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 font-medium">Tổng lịch hẹn</p>
              <p class="text-3xl font-bold text-blue-700">{{ stats.totalBookings }}</p>
            </div>
            <CalendarIcon class="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div class="card bg-green-50 border border-green-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 font-medium">Đã hoàn thành</p>
              <p class="text-3xl font-bold text-green-700">{{ stats.completedBookings }}</p>
            </div>
            <CheckCircleIcon class="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div class="card bg-orange-50 border border-orange-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-orange-600 font-medium">Dịch vụ</p>
              <p class="text-3xl font-bold text-orange-700">{{ services.length }}</p>
            </div>
            <ScissorsIcon class="w-12 h-12 text-orange-400" />
          </div>
        </div>
      </div>

      <!-- Services Section -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ScissorsIcon class="w-6 h-6 text-blue-600" />
            Dịch vụ cung cấp
          </h3>
          <button
            @click="showAddServiceModal = true"
            class="btn-primary flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            Thêm dịch vụ
          </button>
        </div>

        <div v-if="loadingServices" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>

        <div v-else-if="services.length === 0" class="text-center py-12">
          <ScissorsIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-800 mb-2">Chưa có dịch vụ</h3>
          <p class="text-gray-600 mb-4">Thêm dịch vụ để bắt đầu</p>
          <button @click="showAddServiceModal = true" class="btn-primary">
            Thêm dịch vụ đầu tiên
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="service in services"
            :key="service.id"
            class="p-4 border rounded-lg hover:shadow-md transition"
            :class="service.status ? 'border-gray-200' : 'border-red-200 bg-red-50'"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800">{{ service.service_name }}</h4>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-lg font-bold text-blue-600">{{ formatPrice(service.price) }}</span>
                  <span class="text-sm text-gray-600">• {{ service.duration_min }} phút</span>
                </div>
              </div>
              <span
                :class="service.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ service.status ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </div>

            <div class="flex gap-2">
              <button
                @click="editService(service)"
                class="flex-1 text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
              >
                Chỉnh sửa
              </button>
              <button
                @click="toggleServiceStatus(service)"
                class="flex-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded transition"
              >
                {{ service.status ? 'Vô hiệu hóa' : 'Kích hoạt' }}
              </button>
            </div>
          </div>
        </div>
      </div>      

      <!-- Map (if location available) -->
      <div v-if="barber.location" class="card">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPinIcon class="w-6 h-6 text-red-600" />
          Vị trí
        </h3>
        <div class="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
          <p class="text-gray-600">Tích hợp bản đồ (Google Maps / Leaflet)</p>
          <p class="text-sm text-gray-500 mt-2">
            Vĩ độ: {{ barber.location.lat }}, Kinh độ: {{ barber.location.lng }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <BarberFormModal
      v-if="showEditModal"
      :barber="barber"
      @close="showEditModal = false"
      @success="handleBarberUpdated"
    />

    <ServiceFormModal
      v-if="showAddServiceModal || selectedService"
      :barber-id="barber?.id"
      :service="selectedService"
      @close="closeServiceModal"
      @success="handleServiceUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import barberService from '@/api/services/barberService'
import apiClient from '@/api/axios'
import BarberFormModal from '@/components/BarberFormModal.vue'
import ServiceFormModal from '@/components/ServiceFormModal.vue'
import {
  ArrowLeftIcon,
  UserIcon,
  StarIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CalendarDaysIcon,
  CalendarIcon,
  CheckCircleIcon,
  ScissorsIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const barberId = route.params.id

const isLoading = ref(false)
const loadingServices = ref(false)
const loadingBookings = ref(false)
const barber = ref(null)
const services = ref([])
const recentBookings = ref([])
const showEditModal = ref(false)
const showAddServiceModal = ref(false)
const selectedService = ref(null)

const stats = computed(() => {
  const completed = recentBookings.value.filter(b => b.status === 'completed')
  return {
    totalBookings: recentBookings.value.length,
    completedBookings: completed.length,
    totalRevenue: completed.reduce((sum, b) => sum + b.total_price, 0)
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTimeRange = (timeSlot) => {
  if (!timeSlot) return 'N/A'
  const start = timeSlot.start_time?.substring(0, 5) || ''
  const end = timeSlot.end_time?.substring(0, 5) || ''
  return `${start} - ${end}`
}

const getServicesText = (services) => {
  if (!services || services.length === 0) return 'N/A'
  if (services.length === 1) return services[0].service_name
  return `${services[0].service_name} +${services.length - 1}`
}

const getStatusBadge = (status) => {
  const badges = {
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return badges[status] || 'bg-gray-100 text-gray-800'
}

const fetchBarber = async () => {
  isLoading.value = true
  try {
    const response = await barberService.getById(barberId)
    barber.value = response.data
  } catch (error) {
    console.error('Error fetching barber:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchServices = async () => {
  loadingServices.value = true
  try {
    const response = await apiClient.get(`/services/barber/${barberId}`)
    services.value = response.data
  } catch (error) {
    console.error('Error fetching services:', error)
  } finally {
    loadingServices.value = false
  }
}

const fetchBookings = async () => {
  loadingBookings.value = true
  try {
    const response = await apiClient.get(`/bookings/barber/${barberId}`)
    recentBookings.value = response.data.slice(0, 10)
  } catch (error) {
    console.error('Error fetching bookings:', error)
  } finally {
    loadingBookings.value = false
  }
}

const handleBarberUpdated = () => {
  showEditModal.value = false
  fetchBarber()
}

const editService = (service) => {
  selectedService.value = service
}

const closeServiceModal = () => {
  showAddServiceModal.value = false
  selectedService.value = null
}

const handleServiceUpdated = () => {
  closeServiceModal()
  fetchServices()
}

const toggleServiceStatus = async (service) => {
  try {
    await apiClient.patch(`/services/${service.id}/toggle-status`)
    await fetchServices()
  } catch (error) {
    println('Error toggling service status:', error)
    alert('Không thể cập nhật trạng thái dịch vụ')
  }
}

onMounted(() => {
  fetchBarber()
  fetchServices()
  fetchBookings()
})
</script>