<!-- src/views/BarbersView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Quản lý thợ cắt tóc</h2>
        <p class="text-gray-600 mt-1">Quản lý hồ sơ và thông tin của thợ cắt tóc</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary flex items-center gap-2"
      >
        <PlusIcon class="w-5 h-5" />
        Thêm thợ
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="card">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            :value="filters.search"
            @input="handleFilterChange('search', $event.target.value)"
            type="text"
            placeholder="Tìm kiếm thợ..."
            class="input-field pl-10"
          />
        </div>
        
        <select
          :value="filters.status"
          @change="handleFilterChange('status', $event.target.value)"
          class="input-field w-full md:w-48"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Không hoạt động</option>
        </select>

        <select
          :value="filters.area"
          @change="handleFilterChange('area', $event.target.value)"
          class="input-field w-full md:w-48"
        >
          <option value="all">Tất cả khu vực</option>
          <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
        </select>
      </div>
    </div>

    <!-- Barbers Grid -->
    <LoadingSpinner v-if="isLoading" message="Đang tải thợ..." />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BarberCard
        v-for="barber in barbers"
        :key="barber.id"
        :barber="barber"
        @click="viewBarber(barber)"
        @edit="editBarber(barber)"
        @toggle-status="handleToggleStatus(barber)"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-if="!isLoading && barbers.length === 0"
      title="Chưa tìm thấy thợ"
      description="Bắt đầu bằng cách thêm thợ đầu tiên của bạn"
      action-label="Thêm thợ"
      @action="showCreateModal = true"
    >
      <UserGroupIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
    </EmptyState>

    <!-- Create/Edit Modal -->
    <BarberFormModal
      v-if="showCreateModal || selectedBarber"
      :barber="selectedBarber"
      @close="closeModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBarbers } from '@/composables/useBarbers'
import { useBarberStore } from '@/stores/barber'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import BarberFormModal from '@/components/barbers/BarberFormModal.vue'
import BarberCard from '@/components/barbers/BarberCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const store = useBarberStore()
const { barbers, areas, isLoading, fetchBarbers, toggleBarberStatus, setFilter } = useBarbers()

const showCreateModal = ref(false)
const selectedBarber = ref(null)

const filters = computed(() => store.filters)

const handleFilterChange = (key, value) => {
  setFilter(key, value)
}

const viewBarber = (barber) => {
  router.push(`/barbers/${barber.id}`)
}

const editBarber = (barber) => {
  selectedBarber.value = barber
}

const handleToggleStatus = async (barber) => {
  await toggleBarberStatus(barber)
}

const closeModal = () => {
  showCreateModal.value = false
  selectedBarber.value = null
}

const handleSuccess = () => {
  closeModal()
  fetchBarbers()
}

onMounted(() => {
  fetchBarbers()
})
</script>