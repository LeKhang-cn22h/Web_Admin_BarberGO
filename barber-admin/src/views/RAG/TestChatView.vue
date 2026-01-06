<!-- src/views/RAG/TestChatView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800">Test AI Chatbot</h2>
      <p class="text-gray-600 mt-1">Test RAG chatbot với câu hỏi thực tế</p>
    </div>

    <!-- Chat Interface -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chat Box -->
      <div class="lg:col-span-2 card">
        <!-- Messages -->
        <div class="h-[600px] overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
          <div v-if="messages.length === 0" class="text-center py-20 text-gray-500">
            <ChatBubbleLeftRightIcon class="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>Start a conversation with the AI chatbot</p>
            <p class="text-sm mt-2">Try asking: "Làm thế nào để đặt lịch?"</p>
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="[
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-[80%] rounded-lg px-4 py-3',
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              ]"
            >
              <div class="flex items-start gap-2">
                <component
                  :is="msg.role === 'user' ? UserIcon : SparklesIcon"
                  class="w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <div class="flex-1">
                  <p class="text-sm whitespace-pre-wrap">{{ msg.content }}</p>
                  
                  <!-- Confidence Badge -->
                  <div v-if="msg.confidence" class="mt-2">
                    <span
                      :class="getConfidenceBadge(msg.confidence)"
                      class="px-2 py-1 rounded text-xs font-medium"
                    >
                      {{ msg.confidence }} confidence
                    </span>
                  </div>

                  <!-- Sources -->
                  <div v-if="msg.sources && msg.sources.length > 0" class="mt-3 pt-3 border-t border-gray-200">
                    <p class="text-xs font-semibold mb-2">📚 Sources:</p>
                    <div class="space-y-1">
                      <div
                        v-for="(source, idx) in msg.sources"
                        :key="idx"
                        class="text-xs bg-gray-50 p-2 rounded"
                      >
                        <p class="font-medium">Similarity: {{ (source.similarity * 100).toFixed(1) }}%</p>
                        <p class="text-gray-600 line-clamp-1">{{ source.metadata?.output }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div class="flex items-center gap-2">
                <SparklesIcon class="w-5 h-5 text-gray-400" />
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>

          <div ref="messagesEnd"></div>
        </div>

        <!-- Input -->
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="question"
            type="text"
            placeholder="Ask me anything about BarberGo..."
            class="flex-1 input-field"
            :disabled="isTyping"
          />
          <button
            type="submit"
            :disabled="!question.trim() || isTyping"
            class="btn-primary px-6 disabled:opacity-50"
          >
            <PaperAirplaneIcon class="w-5 h-5" />
          </button>
        </form>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Questions -->
        <div class="card">
          <h3 class="font-semibold text-gray-800 mb-4">💡 Quick Test Questions</h3>
          <div class="space-y-2">
            <button
              v-for="q in quickQuestions"
              :key="q"
              @click="askQuickQuestion(q)"
              class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition"
            >
              {{ q }}
            </button>
          </div>
        </div>

       

        <!-- Stats -->
        <div class="card bg-blue-50 border border-blue-200">
          <h3 class="font-semibold text-blue-800 mb-3">📊 Session Stats</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-blue-700">Total Messages:</span>
              <span class="font-semibold text-blue-900">{{ messages.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Questions:</span>
              <span class="font-semibold text-blue-900">{{ userMessages }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Responses:</span>
              <span class="font-semibold text-blue-900">{{ assistantMessages }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import ragService from '@/api/services/ragService'
import {
  ChatBubbleLeftRightIcon,
  UserIcon,
  SparklesIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth' 
const authStore = useAuthStore()              
const messages = ref([])
const question = ref('')
const isTyping = ref(false)
const showSources = ref(true)
const topK = ref(3)
const messagesEnd = ref(null)

const quickQuestions = [
  'Làm thế nào để đặt lịch?',
  'Tôi muốn hủy lịch thì làm sao?',
  'App có mất phí không?',
  'Kiểu tóc nào phù hợp với mặt tròn?',
  'Barber gần tôi ở đâu?'
]

const userMessages = computed(() => messages.value.filter(m => m.role === 'user').length)
const assistantMessages = computed(() => messages.value.filter(m => m.role === 'assistant').length)

const getConfidenceBadge = (confidence) => {
  const badges = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800'
  }
  return badges[confidence] || 'bg-gray-100 text-gray-800'
}

const sendMessage = async () => {
  if (!question.value.trim()) return

  const userQuestion = question.value
  question.value = ''

  // Add user message
  messages.value.push({
    role: 'user',
    content: userQuestion
  })

  scrollToBottom()
  isTyping.value = true

  try {
    const response = await ragService.sendMessage({
      user_id: authStore.user.id    ,
      question: userQuestion,
      session_id: null,
      top_k: topK.value,
      return_sources: showSources.value
    })

    // Add assistant message
    messages.value.push({
      role: 'assistant',
      content: response.data.answer,
      confidence: response.data.confidence,
      sources: response.data.sources
    })

    scrollToBottom()
  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'assistant',
      content: '❌ Lỗi khi xử lý câu hỏi. Vui lòng thử lại.',
      confidence: 'low'
    })
  } finally {
    isTyping.value = false
  }
}

const askQuickQuestion = (q) => {
  question.value = q
  sendMessage()
}

const clearChat = () => {
  if (confirm('Clear all messages?')) {
    messages.value = []
  }
}

const scrollToBottom = async () => {
  await nextTick()
  messagesEnd.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>