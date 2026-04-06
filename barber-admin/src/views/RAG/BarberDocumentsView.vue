<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Barber Vector Documents</h2>
        <p class="text-gray-600 mt-1">Quản lý dữ liệu tiệm barber trong Vector DB</p>
      </div>
      <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
        <PlusIcon class="w-5 h-5" />
        Thêm Document
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label"
        class="card text-center py-4">
        <p class="text-2xl font-bold text-blue-600">{{ stat.value }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="card">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Vector Search -->
        <div class="flex-1 flex gap-2">
          <input
            v-model="vectorQuery"
            type="text"
            placeholder=" Vector search: 'Tiệm nào mở thứ 7?'"
            class="flex-1 input-field"
            @keyup.enter="doVectorSearch"
          />
          <button @click="doVectorSearch" :disabled="isSearching"
            class="btn-primary px-4 disabled:opacity-50">
            <MagnifyingGlassIcon v-if="!isSearching" class="w-5 h-5" />
            <span v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block"/>
          </button>
        </div>

        <!-- Keyword Search -->
        <div class="flex gap-2">
          <input
            v-model="keywordQuery"
            type="text"
            placeholder="Keyword search..."
            class="input-field w-48"
            @keyup.enter="doKeywordSearch"
          />
          <button @click="doKeywordSearch" class="btn-secondary px-4">
            Tìm
          </button>
        </div>

        <!-- Filter type -->
        <select v-model="filterType" @change="loadDocuments" class="input-field w-48">
          <option value="">Tất cả loại</option>
          <option value="opening_hours">Giờ mở cửa</option>
          <option value="services">Dịch vụ</option>
          <option value="service_detail">Chi tiết dịch vụ</option>
          <option value="location">Địa chỉ</option>
          <option value="rating">Đánh giá</option>
          <option value="recommendation">Gợi ý</option>
        </select>

        <button @click="resetSearch" class="btn-secondary px-4">
          Reset
        </button>
      </div>
    </div>

    <!-- Vector Search Results -->
    <div v-if="searchResults.length > 0" class="card border-2 border-blue-200 bg-blue-50">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-blue-800 flex items-center gap-2">
          <SparklesIcon class="w-5 h-5" />
          Kết quả Vector Search ({{ searchResults.length }})
        </h3>
        <button @click="searchResults = []" class="text-blue-600 text-sm hover:underline">
          Đóng
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="result in searchResults" :key="result.id"
          class="bg-white rounded-lg p-4 border border-blue-200">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-gray-800 text-sm">
              {{ result.metadata?.barber_name || 'N/A' }}
            </span>
            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              {{ (result.similarity * 100).toFixed(1) }}%
            </span>
          </div>
          <span class="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded mb-2">
            {{ result.metadata?.type || 'unknown' }}
          </span>
          <p class="text-gray-600 text-xs line-clamp-3">
            {{ result.metadata?.output || result.content }}
          </p>
        </div>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-800">
          Danh sách Documents
          <span class="text-gray-400 text-sm font-normal ml-2">({{ totalDocs }} tổng)</span>
        </h3>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>Hiển thị {{ documents.length }} / {{ totalDocs }}</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"/>
        <p class="text-gray-500 mt-3">Đang tải...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="documents.length === 0" class="text-center py-12 text-gray-500">
        <DocumentIcon class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Không có documents</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-left">
              <th class="pb-3 text-gray-600 font-medium w-12">ID</th>
              <th class="pb-3 text-gray-600 font-medium">Tiệm</th>
              <th class="pb-3 text-gray-600 font-medium">Loại</th>
              <th class="pb-3 text-gray-600 font-medium">Nội dung</th>
              <th class="pb-3 text-gray-600 font-medium">Câu trả lời</th>
              <th class="pb-3 text-gray-600 font-medium w-28 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="doc in documents" :key="doc.id"
              class="hover:bg-gray-50 transition">
              <td class="py-3 text-gray-400">{{ doc.id }}</td>
              <td class="py-3">
                <span class="font-medium text-gray-800">
                  {{ doc.metadata?.barber_name || '—' }}
                </span>
              </td>
              <td class="py-3">
                <span :class="typeColor(doc.metadata?.type)"
                  class="px-2 py-1 rounded text-xs font-medium">
                  {{ typeLabel(doc.metadata?.type) }}
                </span>
              </td>
              <td class="py-3 text-gray-600 max-w-[200px]">
                <p class="truncate">{{ doc.content }}</p>
              </td>
              <td class="py-3 text-gray-600 max-w-[220px]">
                <p class="truncate">{{ doc.metadata?.output || '—' }}</p>
              </td>
              <td class="py-3">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(doc)"
                    class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                    title="Sửa">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(doc.id)"
                    class="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                    title="Xoá">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalDocs > pageSize" class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <button @click="prevPage" :disabled="currentPage === 0"
          class="btn-secondary px-4 disabled:opacity-40">
          ← Trước
        </button>
        <span class="text-sm text-gray-500">
          Trang {{ currentPage + 1 }} / {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="!hasMore"
          class="btn-secondary px-4 disabled:opacity-40">
          Tiếp →
        </button>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">
            {{ isEditing ? 'Sửa Document' : 'Thêm Document' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Câu hỏi / Nội dung <span class="text-red-500">*</span>
            </label>
            <textarea v-model="form.content" rows="3"
              placeholder="Ví dụ: Tiệm Minh Tâm mở cửa mấy giờ?"
              class="input-field w-full resize-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Câu trả lời <span class="text-red-500">*</span>
            </label>
            <textarea v-model="form.output" rows="4"
              placeholder="Ví dụ: Tiệm Minh Tâm mở từ 8:00 đến 20:00..."
              class="input-field w-full resize-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loại</label>
            <select v-model="form.type" class="input-field w-full">
              <option value="">-- Chọn loại --</option>
              <option value="opening_hours">Giờ mở cửa</option>
              <option value="services">Dịch vụ</option>
              <option value="service_detail">Chi tiết dịch vụ</option>
              <option value="location">Địa chỉ</option>
              <option value="rating">Đánh giá</option>
              <option value="recommendation">Gợi ý</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên tiệm</label>
            <input v-model="form.barber_name" type="text"
              placeholder="Ví dụ: Minh Tâm Barber"
              class="input-field w-full" />
          </div>
        </div>

        <div class="flex gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button @click="closeModal" class="btn-secondary flex-1">Huỷ</button>
          <button @click="submitForm" :disabled="isSaving"
            class="btn-primary flex-1 disabled:opacity-50">
            {{ isSaving ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm mới') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import barberDocumentService from '@/api/services/barberDocumentService'
import {
  PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon,
  XMarkIcon, DocumentIcon, SparklesIcon
} from '@heroicons/vue/24/outline'

// ==================== STATE ====================
const documents    = ref([])
const searchResults = ref([])
const isLoading    = ref(false)
const isSearching  = ref(false)
const isSaving     = ref(false)
const totalDocs    = ref(0)
const hasMore      = ref(false)

const vectorQuery  = ref('')
const keywordQuery = ref('')
const filterType   = ref('')

const currentPage  = ref(0)
const pageSize     = 20

const showModal    = ref(false)
const isEditing    = ref(false)
const editingId    = ref(null)

const form = ref({
  content: '', output: '', type: '', barber_name: ''
})

// ==================== COMPUTED ====================
const totalPages = computed(() => Math.ceil(totalDocs.value / pageSize))

const stats = computed(() => [
  { label: 'Tổng documents', value: totalDocs.value },
  { label: 'Giờ mở cửa',    value: countByType('opening_hours') },
  { label: 'Dịch vụ',       value: countByType('services') + countByType('service_detail') },
  { label: 'Gợi ý',         value: countByType('recommendation') },
])

// ==================== METHODS ====================
const countByType = (type) =>
  documents.value.filter(d => d.metadata?.type === type).length

const typeLabel = (type) => ({
  opening_hours:  'Giờ mở cửa',
  services:       'Dịch vụ',
  service_detail: 'Chi tiết DV',
  location:       'Địa chỉ',
  rating:         'Đánh giá',
  recommendation: 'Gợi ý',
}[type] || type || '—')

const typeColor = (type) => ({
  opening_hours:  'bg-blue-100 text-blue-700',
  services:       'bg-green-100 text-green-700',
  service_detail: 'bg-teal-100 text-teal-700',
  location:       'bg-purple-100 text-purple-700',
  rating:         'bg-yellow-100 text-yellow-700',
  recommendation: 'bg-orange-100 text-orange-700',
}[type] || 'bg-gray-100 text-gray-600')

async function loadDocuments() {
  isLoading.value = true
  try {
    const res = await barberDocumentService.getAll(
      pageSize,
      currentPage.value * pageSize,
      filterType.value || null
    )
    documents.value = res.data.documents
    totalDocs.value  = res.data.total
    hasMore.value    = res.data.has_more
  } catch (e) {
    console.error('Load error:', e)
  } finally {
    isLoading.value = false
  }
}

async function doVectorSearch() {
  if (!vectorQuery.value.trim()) return
  isSearching.value = true
  searchResults.value = []
  try {
    const res = await barberDocumentService.searchVector(vectorQuery.value)
    searchResults.value = res.data.results
  } catch (e) {
    console.error('Vector search error:', e)
  } finally {
    isSearching.value = false
  }
}

async function doKeywordSearch() {
  if (!keywordQuery.value.trim()) return
  isLoading.value = true
  try {
    const res = await barberDocumentService.searchKeyword(keywordQuery.value)
    documents.value = res.data.documents
    totalDocs.value  = res.data.total
    hasMore.value    = false
  } catch (e) {
    console.error('Keyword search error:', e)
  } finally {
    isLoading.value = false
  }
}

function resetSearch() {
  vectorQuery.value  = ''
  keywordQuery.value = ''
  filterType.value   = ''
  searchResults.value = []
  currentPage.value  = 0
  loadDocuments()
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    loadDocuments()
  }
}

function nextPage() {
  if (hasMore.value) {
    currentPage.value++
    loadDocuments()
  }
}

// ==================== MODAL ====================
function openCreateModal() {
  isEditing.value  = false
  editingId.value  = null
  form.value       = { content: '', output: '', type: '', barber_name: '' }
  showModal.value  = true
}

function openEditModal(doc) {
  isEditing.value  = true
  editingId.value  = doc.id
  form.value = {
    content:     doc.content || '',
    output:      doc.metadata?.output || '',
    type:        doc.metadata?.type || '',
    barber_name: doc.metadata?.barber_name || '',
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  if (!form.value.content.trim() || !form.value.output.trim()) {
    alert('Vui lòng nhập đầy đủ Câu hỏi và Câu trả lời')
    return
  }

  isSaving.value = true
  try {
    if (isEditing.value) {
      await barberDocumentService.update(editingId.value, {
        new_content:  form.value.content,
        new_output:   form.value.output,
        new_metadata: {
          type:        form.value.type,
          barber_name: form.value.barber_name,
        }
      })
    } else {
      await barberDocumentService.create({
        content: form.value.content,
        output:  form.value.output,
        extra_metadata: {
          type:        form.value.type,
          barber_name: form.value.barber_name,
        }
      })
    }
    closeModal()
    await loadDocuments()
  } catch (e) {
    console.error('Save error:', e)
    alert('Có lỗi xảy ra, vui lòng thử lại')
  } finally {
    isSaving.value = false
  }
}

async function confirmDelete(id) {
  if (!confirm('Xoá document này?')) return
  try {
    await barberDocumentService.deleteOne(id)
    await loadDocuments()
  } catch (e) {
    console.error('Delete error:', e)
  }
}

// ==================== INIT ====================
onMounted(loadDocuments)
</script>