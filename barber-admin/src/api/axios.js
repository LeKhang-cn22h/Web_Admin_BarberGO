// src/api/axios.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // FastAPI URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

// Request interceptor - thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor 
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu lỗi 401 và chưa từng thử lại request này (tránh lặp vô tận)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Đánh dấu đã thử lại

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        
        // Nếu không có refresh token thì buộc phải logout
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Gọi API refresh token (Tạo instance axios mới để tránh dính interceptor của instance cũ)
        const response = await axios.post('http://localhost:8000/users/refresh', {
            refresh_token: refreshToken 
        })

        const { access_token } = response.data

        // 1. Lưu token mới vào LocalStorage
        localStorage.setItem('access_token', access_token)
        
        // 2. Cập nhật header cho request hiện tại
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`

        // 3. Thực hiện lại request ban đầu với token mới
        return apiClient(originalRequest)

      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn hoặc lỗi -> Xóa sạch và về Login
        console.error('Session expired:', refreshError)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient