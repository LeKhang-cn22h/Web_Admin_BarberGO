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
    <LoadingSpinner v-if="isLoading" message="Đang tải chi tiết thợ..." />

    <!-- Content -->
    <div v-else-if="currentBarber" class="space-y-6">
      <!-- Header Card -->
      <BarberDetailHeader
        :barber="currentBarber"
        @edit="showEditModal = true"
      />

      <!-- Stats Cards -->
      <BarberStats :statistics="statistics" />

      <!-- Services Section -->
      <BarberServices
        :services="services"
        :is-loading="isLoadingServices"
        @add="showAddServiceModal = true"
        @edit="editService"
        @toggle-status="handleToggleServiceStatus"
      />

      <!-- Map (only if has valid location) -->
      <BarberMap 
        v-if="hasValidLocation" 
        :location="{ lat: currentBarber.lat, lng: currentBarber.lng }" 
      />
    </div>

    <!-- Modals -->
    <BarberFormModal
      v-if="showEditModal"
      :barber="currentBarber"
      @close="showEditModal = false"
      @success="handleBarberUpdated"
    />

    <ServiceFormModal
      v-if="showAddServiceModal || selectedService"
      :barber-id="currentBarber?.id"
      :service="selectedService"
      @close="closeServiceModal"
      @success="handleServiceUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBarbers } from '@/composables/useBarbers'
import { useServices } from '@/composables/useServices'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import BarberFormModal from '@/components/barbers/BarberFormModal.vue'
import ServiceFormModal from '@/components/barbers/ServiceFormModal.vue'
import BarberDetailHeader from '@/components/barbers/BarberDetailHeader.vue'
import BarberStats from '@/components/barbers/BarberStats.vue'
import BarberServices from '@/components/barbers/BarberServices.vue'
import BarberMap from '@/components/barbers/BarberMap.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const barberId = route.params.id

const { currentBarber, isLoading, fetchBarber } = useBarbers()
const {
  services,
  isLoading: isLoadingServices,
  fetchServices,
  toggleServiceStatus
} = useServices(barberId)

const showEditModal = ref(false)
const showAddServiceModal = ref(false)
const selectedService = ref(null)

// Check if has valid location
const hasValidLocation = computed(() => {
  return currentBarber.value?.lat && currentBarber.value?.lng
})

const statistics = computed(() => ({
  totalBookings: 0,
  completedBookings: 0,
  totalServices: services.value.length
}))

const editService = (service) => {
  selectedService.value = service
}

const closeServiceModal = () => {
  showAddServiceModal.value = false
  selectedService.value = null
}

const handleBarberUpdated = () => {
  showEditModal.value = false
  fetchBarber(barberId)
}

const handleServiceUpdated = () => {
  closeServiceModal()
  fetchServices()
}

const handleToggleServiceStatus = async (service) => {
  await toggleServiceStatus(service)
}

onMounted(async () => {
  await fetchBarber(barberId)
  await fetchServices()
})
</script>