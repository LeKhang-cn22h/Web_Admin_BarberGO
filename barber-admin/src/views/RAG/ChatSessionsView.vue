<!-- src/views/RAG/ChatSessionsView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Chat Sessions Management</h2>
        <p class="text-gray-600 mt-1">Quản lý lịch sử chat của users với AI chatbot</p>
      </div>
    </div>

    <!-- Search User -->
    <div class="card">
      <div class="flex gap-4">
        <div class="flex-1 relative">
          <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchUserId"
            type="text"
            placeholder="Enter User ID to view their sessions..."
            class="input-field pl-10"
          />
        </div>
        <button @click="loadUserSessions" class="btn-primary">
          Load Sessions
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card bg-blue-50 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Sessions</p>
            <p class="text-3xl font-bold text-blue-700">{{ sessions.length }}</p>
          </div>
          <ChatBubbleLeftRightIcon class="w-12 h-12 text-blue-400" />
        </div>
      </div>

      <div class="card bg-green-50 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">Active Today</p>
            <p class="text-3xl font-bold text-green-700">{{ activeTodaySessions }}</p>
          </div>
          <CalendarIcon class="w-12 h-12 text-green-400" />
        </div>
      </div>

      <div class="card bg-purple-50 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-600 font-medium">Total Messages</p>
            <p class="text-3xl font-bold text-purple-700">{{ totalMessages }}</p>
          </div>
          <ChatBubbleBottomCenterTextIcon class="w-12 h-12 text-purple-400" />
        </div>
      </div>

      <div class="card bg-orange-50 border border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-orange-600 font-medium">Avg per Session</p>
            <p class="text-3xl font-bold text-orange-700">{{ avgMessagesPerSession }}</p>
          </div>
          <ChartBarIcon class="w-12 h-12 text-orange-400" />
        </div>
      </div>
    </div>

    <!-- Sessions List -->
    <div class="card">
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading sessions...</p>
      </div>

      <div v-else-if="!currentUserId" class="text-center py-12">
        <UserIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-800 mb-2">No user selected</h3>
        <p class="text-gray-600">Enter a User ID above to view their chat sessions</p>
      </div>

      <div v-else-if="sessions.length === 0" class="text-center py-12">
        <ChatBubbleLeftRightIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-800 mb-2">No sessions found</h3>
        <p class="text-gray-600">User hasn't started any chat sessions yet</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="session in sessions"
          :key="session.id"
          class="border rounded-lg hover:shadow-md transition"
        >
          <div class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="font-semibold text-gray-800">{{ session.title }}</h3>
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {{ session.messageCount || 0 }} messages
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <CalendarIcon class="w-4 h-4" />
                    {{ formatDate(session.created_at) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <ClockIcon class="w-4 h-4" />
                    {{ formatTime(session.created_at) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="viewSession(session)"
                  class="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50"
                  title="View Messages"
                >
                  <EyeIcon class="w-5 h-5" />
                </button>
                <button
                  @click="editSessionTitle(session)"
                  class="text-green-600 hover:text-green-800 p-2 rounded hover:bg-green-50"
                  title="Edit Title"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
                <button
                  @click="deleteSession(session)"
                  class="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
                  title="Delete Session"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Messages Preview (collapsed) -->
            <div
              v-if="expandedSession === session.id && sessionMessages[session.id]"
              class="mt-4 pt-4 border-t space-y-3 max-h-96 overflow-y-auto"
            >
              <div
                v-for="msg in sessionMessages[session.id]"
                :key="msg.id"
                :class="[
                  'p-3 rounded-lg',
                  msg.role === 'user' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-green-50 border-l-4 border-green-500'
                ]"
              >
                <div class="flex items-start gap-2 mb-2">
                  <component
                    :is="msg.role === 'user' ? UserIcon : SparklesIcon"
                    class="w-4 h-4 mt-0.5 flex-shrink-0"
                    :class="msg.role === 'user' ? 'text-blue-600' : 'text-green-600'"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-semibold text-gray-700">
                        {{ msg.role === 'user' ? 'User' : 'AI Assistant' }}
                      </span>
                      <span class="text-xs text-gray-500">{{ formatTime(msg.created_at) }}</span>
                      <span
                        v-if="msg.confidence"
                        :class="getConfidenceBadge(msg.confidence)"
                        class="px-2 py-0.5 rounded text-xs font-medium"
                      >
                        {{ msg.confidence }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ msg.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Toggle Button -->
            <button
              @click="toggleSession(session)"
              class="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <component
                :is="expandedSession === session.id ? ChevronUpIcon : ChevronDownIcon"
                class="w-4 h-4"
              />
              {{ expandedSession === session.id ? 'Hide' : 'Show' }} Messages
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Title Modal -->
    <EditSessionModal
      v-if="editingSession"
      :session="editingSession"
      @close="editingSession = null"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ragService from '@/api/services/ragService'
import EditSessionModal from '@/components/RAG/EditSessionModal.vue'
import {
  UserIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartBarIcon,
  ClockIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/vue/24/outline'

const isLoading = ref(false)
const searchUserId = ref('')
const currentUserId = ref('')
const sessions = ref([])
const sessionMessages = ref({})
const expandedSession = ref(null)
const editingSession = ref(null)

const activeTodaySessions = computed(() => {
  const today = new Date().toDateString()
  return sessions.value.filter(s => {
    const sessionDate = new Date(s.created_at).toDateString()
    return sessionDate === today
  }).length
})

const totalMessages = computed(() => {
  return sessions.value.reduce((sum, s) => sum + (s.messageCount || 0), 0)
})

const avgMessagesPerSession = computed(() => {
  if (sessions.value.length === 0) return 0
  return Math.round(totalMessages.value / sessions.value.length)
})

const loadUserSessions = async () => {
  if (!searchUserId.value.trim()) {
    alert('Please enter a User ID')
    return
  }

  isLoading.value = true
  currentUserId.value = searchUserId.value

  try {
    const response = await ragService.getUserSessions(searchUserId.value)
    sessions.value = response.data.sessions

    // Load message count for each session
    for (const session of sessions.value) {
      const msgResponse = await ragService.getSessionMessages(session.id)
      session.messageCount = msgResponse.data.messages.length
    }
  } catch (error) {
    console.error('Error loading sessions:', error)
    alert('Failed to load sessions')
  } finally {
    isLoading.value = false
  }
}

const toggleSession = async (session) => {
  if (expandedSession.value === session.id) {
    expandedSession.value = null
    return
  }

  expandedSession.value = session.id

  // Load messages if not already loaded
  if (!sessionMessages.value[session.id]) {
    try {
      const response = await ragService.getSessionMessages(session.id)
      sessionMessages.value[session.id] = response.data.messages
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }
}

const viewSession = (session) => {
  toggleSession(session)
}

const editSessionTitle = (session) => {
  editingSession.value = session
}

const deleteSession = async (session) => {
  if (!confirm(`Delete session "${session.title}"?\n\nThis will delete all messages in this session.`)) {
    return
  }

  try {
    await ragService.deleteSession(session.id)
    sessions.value = sessions.value.filter(s => s.id !== session.id)
  } catch (error) {
    alert('Failed to delete session')
  }
}

const handleEditSuccess = () => {
  editingSession.value = null
  loadUserSessions()
}

const getConfidenceBadge = (confidence) => {
  const badges = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800'
  }
  return badges[confidence] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>