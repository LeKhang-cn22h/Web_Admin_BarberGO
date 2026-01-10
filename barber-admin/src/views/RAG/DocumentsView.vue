<!-- src/views/RAG/DocumentsView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Knowledge Base Management</h2>
        <p class="text-gray-600 mt-1">Quản lý dữ liệu huấn luyện cho AI Chatbot</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary flex items-center gap-2"
      >
        <PlusIcon class="w-5 h-5" />
        Add Document
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="card">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search documents by keyword..."
            class="input-field pl-10"
          />
        </div>
        
        <!-- Type Filter -->
        <select
          v-model="filterType"
          @change="handleFilterChange"
          class="input-field w-48"
        >
          <option value="">All Types</option>
          <option value="app">App</option>
          <option value="beauty">Beauty</option>
          <option value="policy">Policy</option>
          <option value="general">General</option>
        </select>

        <button @click="handleSearch" class="btn-primary">
          Search
        </button>
        <button @click="clearSearch" class="btn-secondary">
          Clear
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card bg-blue-50 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Documents</p>
            <p class="text-3xl font-bold text-blue-700">{{ totalDocuments }}</p>
          </div>
          <DocumentTextIcon class="w-12 h-12 text-blue-400" />
        </div>
      </div>

      <div class="card bg-green-50 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">App</p>
            <p class="text-3xl font-bold text-green-700">{{ typeStats.app }}</p>
          </div>
          <CheckCircleIcon class="w-12 h-12 text-green-400" />
        </div>
      </div>

      <div class="card bg-purple-50 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-600 font-medium">Beauty</p>
            <p class="text-3xl font-bold text-purple-700">{{ typeStats.beauty }}</p>
          </div>
          <ChartBarIcon class="w-12 h-12 text-purple-400" />
        </div>
      </div>

      <div class="card bg-orange-50 border border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-orange-600 font-medium">Other</p>
            <p class="text-3xl font-bold text-orange-700">{{ typeStats.other }}</p>
          </div>
          <ChartBarIcon class="w-12 h-12 text-orange-400" />
        </div>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="card">
      <div v-if="isLoading && documents.length === 0" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading documents...</p>
      </div>

      <div v-else-if="documents.length === 0" class="text-center py-12">
        <DocumentTextIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-800 mb-2">No documents found</h3>
        <p class="text-gray-600 mb-4">Add your first knowledge base document</p>
        <button @click="showCreateModal = true" class="btn-primary">
          Add Document
        </button>
      </div>

      <div v-else>
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b sticky top-0">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Output</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="doc in documents" :key="doc.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ doc.id }}</td>
                
                <!-- Content -->
                <td class="px-6 py-4 max-w-xs">
                  <p class="text-sm text-gray-800 line-clamp-2">{{ doc.content }}</p>
                </td>
                
                <!-- Output -->
                <td class="px-6 py-4 max-w-md">
                  <p class="text-sm text-gray-600 line-clamp-2">{{ doc.metadata?.output || 'N/A' }}</p>
                </td>
                
                <!-- Type Badge -->
                <td class="px-6 py-4">
                  <span 
                    :class="getTypeBadgeClass(doc.metadata?.type)"
                    class="px-3 py-1 text-xs font-medium rounded-full"
                  >
                    {{ getTypeLabel(doc.metadata?.type) }}
                  </span>
                </td>
                
                <!-- Actions -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button
                      @click="viewDocument(doc)"
                      class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      title="View"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="editDocument(doc)"
                      class="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                      title="Edit"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="deleteDoc(doc)"
                      class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading More Indicator -->
        <div v-if="isLoadingMore" class="text-center py-6 border-t">
          <div class="flex items-center justify-center gap-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="text-gray-600">Loading more documents...</span>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-else-if="hasMore && !isLoadingMore" class="flex justify-center py-6 border-t bg-gray-50">
          <button
            @click="loadMore"
            class="btn-primary px-8 flex items-center gap-2"
          >
            <ArrowDownIcon class="w-5 h-5" />
            <span>Load More Documents</span>
            <span class="text-sm opacity-80">
              ({{ documents.length }} / {{ totalDocuments }})
            </span>
          </button>
        </div>

        <!-- All Loaded Message -->
        <div v-else-if="!hasMore && documents.length > 0" class="text-center py-6 border-t bg-green-50">
          <div class="flex items-center justify-center gap-2 text-green-700">
            <CheckCircleIcon class="w-5 h-5" />
            <span class="font-medium">✅ All {{ totalDocuments }} documents loaded</span>
          </div>
        </div>

        <!-- Scroll Sentinel -->
        <div ref="scrollSentinel" class="h-1"></div>
      </div>
    </div>

    <!-- Modals -->
    <DocumentFormModal
      v-if="showCreateModal || selectedDocument"
      :document="selectedDocument"
      @close="closeModal"
      @success="handleSuccess"
    />

    <DocumentViewModal
      v-if="viewingDocument"
      :document="viewingDocument"
      @close="viewingDocument = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ragService from '@/api/services/ragService'
import DocumentFormModal from '@/components/RAG/DocumentFormModal.vue'
import DocumentViewModal from '@/components/RAG/DocumentViewModal.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const isLoading = ref(false)
const isLoadingMore = ref(false)
const documents = ref([])
const totalDocuments = ref(0)
const hasMore = ref(false)
const currentOffset = ref(0)
const itemsPerPage = 50

const searchKeyword = ref('')
const filterType = ref('')  // ✅ New filter
const showCreateModal = ref(false)
const selectedDocument = ref(null)
const viewingDocument = ref(null)
const scrollSentinel = ref(null)
const observer = ref(null)

// ✅ Calculate type stats
const typeStats = computed(() => {
  const stats = {
    app: 0,
    beauty: 0,
    policy: 0,
    general: 0,
    other: 0
  }

  documents.value.forEach(doc => {
    const type = doc.metadata?.type || 'general'
    if (stats[type] !== undefined) {
      stats[type]++
    } else {
      stats.other++
    }
  })

  return stats
})

const loadProgress = computed(() => {
  if (totalDocuments.value === 0) return 0
  return Math.round((documents.value.length / totalDocuments.value) * 100)
})

// ✅ Helper functions for type display
const getTypeLabel = (type) => {
  const labels = {
    app: 'App',
    beauty: 'Beauty',
    policy: 'Policy',
    general: 'General'
  }
  return labels[type] || 'Unknown'
}

const getTypeBadgeClass = (type) => {
  const classes = {
    app: 'bg-blue-100 text-blue-700',
    beauty: 'bg-pink-100 text-pink-700',
    policy: 'bg-purple-100 text-purple-700',
    general: 'bg-gray-100 text-gray-700'
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
}

// ✅ Fetch documents
const fetchDocuments = async (reset = false) => {
  if (isLoadingMore.value) return
  
  if (reset) {
    currentOffset.value = 0
    documents.value = []
    totalDocuments.value = 0
    hasMore.value = false
  }

  if (reset || documents.value.length === 0) {
    isLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const response = await ragService.getAllDocuments(itemsPerPage, currentOffset.value)
    
    console.log('📄 Loaded documents:', response.data)
    
    totalDocuments.value = response.data.total || response.data.documents.length
    hasMore.value = response.data.has_more || false

    if (reset) {
      documents.value = response.data.documents
    } else {
      documents.value.push(...response.data.documents)
    }

    currentOffset.value += itemsPerPage

    console.log(`📊 Total: ${totalDocuments.value}, Loaded: ${documents.value.length}, Has More: ${hasMore.value}`)

  } catch (error) {
    console.error('❌ Error fetching documents:', error)
    alert('Failed to load documents')
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const loadMore = () => {
  if (!hasMore.value || isLoadingMore.value) return
  fetchDocuments(false)
}

// ✅ Setup Intersection Observer
const setupIntersectionObserver = () => {
  if (observer.value) {
    observer.value.disconnect()
  }

  observer.value = new IntersectionObserver(
    (entries) => {
      const sentinel = entries[0]
      
      if (sentinel.isIntersecting && hasMore.value && !isLoadingMore.value) {
        console.log('🔄 Scroll sentinel visible, loading more...')
        loadMore()
      }
    },
    {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    }
  )

  if (scrollSentinel.value) {
    observer.value.observe(scrollSentinel.value)
  }
}

// ✅ Search & Filter
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    await fetchDocuments(true)
    return
  }

  isLoading.value = true
  try {
    const response = await ragService.searchDocuments(searchKeyword.value)
    
    let filteredDocs = response.data.documents

    // Apply type filter if set
    if (filterType.value) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.metadata?.type === filterType.value
      )
    }

    documents.value = filteredDocs
    totalDocuments.value = filteredDocs.length
    hasMore.value = false

  } catch (error) {
    console.error('❌ Error searching:', error)
  } finally {
    isLoading.value = false
  }
}

const handleFilterChange = () => {
  // If searching, re-apply filter
  if (searchKeyword.value.trim()) {
    handleSearch()
  } else {
    // If not searching, just filter current documents
    fetchDocuments(true)
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  filterType.value = ''
  fetchDocuments(true)
}

// ✅ CRUD operations
const viewDocument = (doc) => {
  viewingDocument.value = doc
}

const editDocument = (doc) => {
  selectedDocument.value = doc
}

const deleteDoc = async (doc) => {
  if (!confirm(`Delete document "${doc.content.substring(0, 50)}..."?`)) return

  try {
    await ragService.deleteDocument(doc.id)
    
    documents.value = documents.value.filter(d => d.id !== doc.id)
    totalDocuments.value--
    
  } catch (error) {
    console.error('❌ Error deleting document:', error)
    alert('Failed to delete document')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  selectedDocument.value = null
}

const handleSuccess = () => {
  closeModal()
  fetchDocuments(true)
}

// ✅ Lifecycle
onMounted(async () => {
  await fetchDocuments(true)
  
  setTimeout(() => {
    setupIntersectionObserver()
  }, 100)
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>