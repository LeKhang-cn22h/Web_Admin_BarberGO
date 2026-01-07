import { defineStore } from 'pinia'
import apiClient from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isOwner: (state) => state.user?.role === 'owner',
  },

  actions: {
    // ==================== LOGIN ====================
    async login(email, password) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.post('/users/login', { 
          email, 
          password 
        })
        
        //  Backend trả về: { access_token, user }
        this.token = response.data.access_token
        this.refreshToken = response.data.refresh_token
        this.user = response.data.user
        localStorage.setItem('access_token', this.token)
        localStorage.setItem('refresh_token', this.refreshToken)
        console.log(' Login successful:', this.user)
        return true
      } catch (error) {
        console.error(' Login error:', error.response?.data || error)
        this.error = error.response?.data?.detail || 'Login failed'
        return false
      } finally {
        this.isLoading = false
      }
    },

    // ==================== REGISTER ====================
    async register(userData) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.post('/users/register', userData)
        console.log('Registration successful:', response.data)
        return { success: true, data: response.data }
      } catch (error) {
        console.error(' Register error:', error.response?.data || error)
        this.error = error.response?.data?.detail || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // ==================== CREATE OWNER ====================
    async createOwner(ownerData) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.post('/users/create-owner', ownerData)
        console.log('Owner created:', response.data)
        return { success: true, data: response.data }
      } catch (error) {
        console.error(' Create owner error:', error.response?.data || error)
        this.error = error.response?.data?.detail || 'Failed to create owner'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // ==================== GOOGLE LOGIN ====================
    async googleLogin(idToken) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.post('/users/google', { 
          id_token: idToken 
        })
        
        // Backend trả về access_token và user
        this.token = response.data.access_token
        this.user = response.data.user
        localStorage.setItem('access_token', this.token)
        
        console.log('Google login successful:', this.user)
        return true
      } catch (error) {
        console.error(' Google login error:', error.response?.data || error)
        this.error = error.response?.data?.detail || 'Google login failed'
        return false
      } finally {
        this.isLoading = false
      }
    },

    // ==================== FORGOT PASSWORD ====================
    async forgotPassword(email) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.post('/users/forgot-password', { email })
        console.log('Password reset email sent')
        return { success: true, data: response.data }
      } catch (error) {
        console.error(' Forgot password error:', error.response?.data || error)
        this.error = error.response?.data?.detail || 'Failed to send reset email'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // ==================== RESET PASSWORD ====================
    async resetPassword(token, newPassword) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.post('/users/reset-password', { 
          token, 
          new_password: newPassword 
        })
        console.log('Password reset successful')
        return { success: true, data: response.data }
      } catch (error) {
        console.error(' Reset password error:', error.response?.data || error)
        this.error = error.response?.data?.detail || 'Failed to reset password'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // ==================== RESEND CONFIRMATION ====================
    async resendConfirmation(email) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.post('/users/resend-confirmation', { email })
        console.log('Confirmation email resent')
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Resend confirmation error:', error.response?.data || error)
        this.error = error.response?.data?.detail || 'Failed to resend confirmation'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // ==================== FETCH CURRENT USER ====================
    async fetchUser() {
      if (!this.token) return
      
      try {
        // Dùng endpoint GET /users/{user_id}
        const userId = this.user?.id
        
        if (userId) {
          const response = await apiClient.get(`/users/${userId}`)
          this.user = response.data
          console.log('User fetched:', this.user)
        }
      } catch (error) {
        console.error(' Fetch user error:', error)
        this.logout()
      }
    },

    // ==================== UPDATE USER ====================
    async updateUser(userId, userData) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.put(`/users/${userId}`, userData)
        
        // Cập nhật user trong store nếu là chính mình
        if (userId === this.user?.id) {
          this.user = { ...this.user, ...response.data }
        }
        
        console.log('User updated:', response.data)
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Update user error:', error.response?.data || error)
        this.error = error.response?.data?.detail || 'Failed to update user'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // ==================== LOGOUT ====================
    async logout() {
      this.token = null
      this.user = null
      this.error = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      console.log(' Logged out')
    },

    // ==================== CLEAR ERROR ====================
    clearError() {
      this.error = null
    }
  }
})