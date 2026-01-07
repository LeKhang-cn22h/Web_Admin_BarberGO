// src/composables/useFormatters.js

export function useFormatters() {
  /**
   * Format date to Vietnamese format
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    
    const date = new Date(dateString)
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  /**
   * Format date to short format (without time)
   */
  const formatDateShort = (dateString) => {
    if (!dateString) return '-'
    
    const date = new Date(dateString)
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date)
  }

  /**
   * Format time only
   */
  const formatTime = (dateString) => {
    if (!dateString) return '-'
    
    const date = new Date(dateString)
    
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  /**
   * Format phone number
   */
  const formatPhone = (phone) => {
    if (!phone) return '-'
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Format as: 0xxx xxx xxx
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
    }
    
    return phone
  }

  /**
   * Format currency (VND)
   */
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-'
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  /**
   * Format number
   */
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-'
    
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '-'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    
    return formatDateShort(dateString)
  }

  /**
   * Truncate text
   */
  const truncate = (text, length = 50) => {
    if (!text) return '-'
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

  return {
    formatDate,
    formatDateShort,
    formatTime,
    formatPhone,
    formatCurrency,
    formatNumber,
    formatRelativeTime,
    truncate
  }
}