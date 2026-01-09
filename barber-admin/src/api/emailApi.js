import apiClient from './axios'

export const emailApi = {
  /**
   * Gửi email thông tin đăng nhập Owner (đơn giản)
   */
  sendOwnerCredentials: async (data) => {
    try {
      const response = await apiClient.post('/api/email/send-owner-credentials', {
        recipient: data.recipient,
        email: data.email,
        password: data.password
      })
      return response.data
    } catch (error) {
      console.error('Error sending owner credentials:', error)
      throw error
    }
  },

  /**
   * Gửi email đơn giản
   */
  sendSimpleEmail: async (data) => {
    try {
      const response = await apiClient.post('/api/email/send-simple', data)
      return response.data
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }
}