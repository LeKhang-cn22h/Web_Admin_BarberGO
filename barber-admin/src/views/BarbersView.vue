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
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm thợ..."
            class="input-field pl-10"
          />
        </div>
        
        <select v-model="filterStatus" class="input-field w-full md:w-48">
          <option value="all">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Không hoạt động</option>
        </select>

        <select v-model="filterArea" class="input-field w-full md:w-48">
          <option value="all">Tất cả khu vực</option>
          <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
        </select>
      </div>
    </div>

    <!-- Barbers Grid -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Đang tải thợ...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="barber in filteredBarbers"
        :key="barber.id"
        class="card hover:shadow-xl transition group cursor-pointer"
        @click="viewBarber(barber)"
      >
        <!-- Image -->
        <div class="relative mb-4">
          <img
            v-if="barber.imagepath"
            :src="barber.imagepath"
            :alt="barber.name"
            class="w-full h-48 object-cover rounded-lg"
          />
          <div v-else class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <UserIcon class="w-20 h-20 text-gray-400" />
          </div>

          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                barber.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              ]"
            >
              {{ barber.status ? 'Hoạt động' : 'Không hoạt động' }}
            </span>
          </div>
        </div>

        <!-- Info -->
        <div>
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
              {{ barber.name }}
            </h3>
            <div class="flex items-center gap-1">
              <StarIcon class="w-4 h-4 text-yellow-500 fill-current" />
              <span class="text-sm font-medium">{{ barber.rank || 0 }}</span>
            </div>
          </div>

          <div class="space-y-2 text-sm text-gray-600">
            <div v-if="barber.address" class="flex items-start gap-2">
              <MapPinIcon class="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span class="line-clamp-2">{{ barber.address }}</span>
            </div>

            <div v-if="barber.area" class="flex items-center gap-2">
              <BuildingStorefrontIcon class="w-4 h-4" />
              <span>{{ barber.area }}</span>
            </div>

            <div v-if="barber.opening_time && barber.closing_time" class="flex items-center gap-2">
              <ClockIcon class="w-4 h-4" />
              <span>{{ barber.opening_time }} - {{ barber.closing_time }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 mt-4 pt-4 border-t">
            <button
              @click.stop="editBarber(barber)"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
            >
              Chỉnh sửa
            </button>
            <button
              @click.stop="toggleStatus(barber)"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 rounded-lg transition"
            >
              {{ barber.status ? 'Vô hiệu hóa' : 'Kích hoạt' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && filteredBarbers.length === 0" class="card text-center py-12">
      <UserGroupIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-800 mb-2">Chưa tìm thấy thợ</h3>
      <p class="text-gray-600 mb-4">Bắt đầu bằng cách thêm thợ đầu tiên của bạn</p>
      <button @click="showCreateModal = true" class="btn-primary">
        Thêm thợ
      </button>
    </div>

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
import barberService from '@/api/services/barberService'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  StarIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import BarberFormModal from '@/components/BarberFormModal.vue'

const router = useRouter()

const isLoading = ref(false)
const barbers = ref([])
const searchQuery = ref('')
const filterStatus = ref('all')
const filterArea = ref('all')
const showCreateModal = ref(false)
const selectedBarber = ref(null)

const areas = computed(() => {
  const uniqueAreas = [...new Set(barbers.value.map(b => b.area).filter(Boolean))]
  return uniqueAreas.sort()
})

const filteredBarbers = computed(() => {
  let result = barbers.value

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.address?.toLowerCase().includes(query) ||
      b.area?.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value !== 'all') {
    const status = filterStatus.value === 'true'
    result = result.filter(b => b.status === status)
  }

  // Filter by area
  if (filterArea.value !== 'all') {
    result = result.filter(b => b.area === filterArea.value)
  }

  return result
})

const fetchBarbers = async () => {
  isLoading.value = true
  try {
    const response = await barberService.getAll()
    barbers.value = response.data
  } catch (error) {
    console.error('Error fetching barbers:', error)
  } finally {
    isLoading.value = false
  }
}

const viewBarber = (barber) => {
  router.push(`/barbers/${barber.id}`)
}

const editBarber = (barber) => {
  selectedBarber.value = barber
}

const toggleStatus = async (barber) => {
  const action = barber.status ? 'vô hiệu hóa' : 'kích hoạt'
  if (confirm(`Bạn có chắc muốn ${action} thợ này không?`)) {
    try {
      await barberService.update(barber.id, { status: !barber.status })
      await fetchBarbers()
    } catch (error) {
      alert('Cập nhật trạng thái thợ thất bại')
    }
  }
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