<!-- src/components/RAG/DocumentViewModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-800">Document Details</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Document ID & Instruction -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-600">Document ID</p>
              <p class="font-semibold text-gray-800">{{ document.id }}</p>
            </div>
            
            <div v-if="document.metadata?.instruction">
              <p class="text-gray-600">Instruction</p>
              <span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {{ document.metadata.instruction }}
              </span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div>
          <h4 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <DocumentTextIcon class="w-5 h-5 text-blue-600" />
            Content
          </h4>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-gray-800 whitespace-pre-wrap">{{ document.content }}</p>
          </div>
        </div>

        <!-- Input (từ metadata) -->
        <div v-if="document.metadata?.input">
          <h4 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <ChatBubbleBottomCenterTextIcon class="w-5 h-5 text-indigo-600" />
            Input (Question)
          </h4>
          <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p class="text-gray-800 whitespace-pre-wrap">{{ document.metadata.input }}</p>
          </div>
        </div>

        <!-- Output -->
        <div>
          <h4 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <ChatBubbleLeftRightIcon class="w-5 h-5 text-green-600" />
            Output (Answer)
          </h4>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <p class="text-gray-800 whitespace-pre-wrap">{{ document.metadata?.output || 'N/A' }}</p>
          </div>
        </div>

        <!-- Full Metadata (JSON) -->
        <div>
          <h4 class="font-semibold text-gray-800 mb-2">Full Metadata (JSON)</h4>
          <div class="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
            <pre class="text-xs">{{ JSON.stringify(document.metadata, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="border-t px-6 py-4">
        <button @click="$emit('close')" class="btn-secondary w-full">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  XMarkIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  ChatBubbleBottomCenterTextIcon 
} from '@heroicons/vue/24/outline'

defineProps({
  document: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])
</script>