// src/composables/useNotification.js
export function useNotification() {
  const showSuccess = (message) => {
    // Implement your notification logic (toast, alert, etc.)
    console.log('✅ Success:', message)
    // Example: toast.success(message)
  }

  const showError = (message) => {
    console.error('❌ Error:', message)
    // Example: toast.error(message)
  }

  const showInfo = (message) => {
    console.log('ℹ️ Info:', message)
  }

  const showWarning = (message) => {
    console.warn('⚠️ Warning:', message)
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}