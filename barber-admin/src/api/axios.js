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

// Response interceptor - xử lý lỗi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient