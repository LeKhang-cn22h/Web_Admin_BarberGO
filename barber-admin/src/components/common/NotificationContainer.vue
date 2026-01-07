<!-- src/components/common/NotificationContainer.vue -->
<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'flex items-start gap-3 p-4 rounded-lg shadow-lg',
          notificationClasses[notification.type]
        ]"
      >
        <!-- Icon -->
        <component :is="notificationIcons[notification.type]" class="w-5 h-5 flex-shrink-0 mt-0.5" />
        
        <!-- Message -->
        <p class="flex-1 text-sm font-medium">{{ notification.message }}</p>
        
        <!-- Close Button -->
        <button
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 hover:opacity-70"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'
import { useNotification } from '@/composables/useNotification'

const { notifications, removeNotification } = useNotification()

const notificationClasses = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200'
}

const notificationIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>