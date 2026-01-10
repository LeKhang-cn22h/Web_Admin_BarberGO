// src/stores/barber.js
import { defineStore } from 'pinia'
import barberService from '@/api/services/barberService'
import serviceService from '@/api/services/serviceService'

export const useBarberStore = defineStore('barber', {
  state: () => ({
    barbers: [],
    currentBarber: null,
    services: [],
    isLoading: false,
    isLoadingServices: false,
    error: null,
    filters: {
      search: '',
      status: 'all',
      area: 'all'
    }
  }),

  getters: {
    /**
     * Get filtered barbers based on current filters
     */
    filteredBarbers: (state) => {
      let result = state.barbers

      // Filter by search
      if (state.filters.search) {
        const query = state.filters.search.toLowerCase()
        result = result.filter(b =>
          b.name?.toLowerCase().includes(query) ||
          b.address?.toLowerCase().includes(query) ||
          b.area?.toLowerCase().includes(query)
        )
      }

      // Filter by status
      if (state.filters.status !== 'all') {
        const status = state.filters.status === 'true'
        result = result.filter(b => b.status === status)
      }

      // Filter by area
      if (state.filters.area !== 'all') {
        result = result.filter(b => b.area === state.filters.area)
      }

      return result
    },

    /**
     * Get unique areas from barbers
     */
    areas: (state) => {
      const uniqueAreas = [...new Set(
        state.barbers
          .map(b => b.area)
          .filter(Boolean)
      )]
      return uniqueAreas.sort()
    },

    /**
     * Get active barbers
     */
    activeBarbers: (state) => 
      state.barbers.filter(b => b.status === true),

    /**
     * Get barber statistics
     */
    statistics: (state) => ({
      total: state.barbers.length,
      active: state.barbers.filter(b => b.status === true).length,
      inactive: state.barbers.filter(b => b.status === false).length,
      totalServices: state.services.length
    })
  },

  actions: {
    /**
     * Fetch all barbers
     */
    async fetchAll(skip = 0, limit = 100) {
      this.isLoading = true
      this.error = null

      try {
        this.barbers = await barberService.getAll(skip, limit)
      } catch (error) {
        this.error = error.message
        console.error('Error fetching barbers:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch barber by ID
     */
    async fetchById(id) {
      this.isLoading = true
      this.error = null

      try {
        this.currentBarber = await barberService.getById(id)
        return this.currentBarber
      } catch (error) {
        this.error = error.message
        console.error('Error fetching barber:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch top barbers
     */
    async fetchTopBarbers(limit = 2) {
      try {
        return await barberService.getTopBarbers(limit)
      } catch (error) {
        console.error('Error fetching top barbers:', error)
        throw error
      }
    },

    /**
     * Create new barber
     */
    async createBarber(data) {
      this.error = null

      try {
        const newBarber = await barberService.create(data)
        this.barbers.push(newBarber)
        return newBarber
      } catch (error) {
        this.error = error.message
        console.error('Error creating barber:', error)
        throw error
      }
    },

    /**
     * Update barber
     */
    async updateBarber(id, data) {
      this.error = null

      try {
        const updated = await barberService.update(id, data)
        
        // Update in local state
        const index = this.barbers.findIndex(b => b.id === id)
        if (index !== -1) {
          this.barbers[index] = updated
        }

        if (this.currentBarber?.id === id) {
          this.currentBarber = updated
        }

        return updated
      } catch (error) {
        this.error = error.message
        console.error('Error updating barber:', error)
        throw error
      }
    },

    /**
     * Upload barber image
     */
    async uploadBarberImage(id, file) {
      try {
        return await barberService.uploadImage(id, file)
      } catch (error) {
        this.error = error.message
        console.error('Error uploading image:', error)
        throw error
      }
    },

    /**
     * Delete barber
     */
    async toggleBarberStatus(id) {
  this.error = null
  
  try {
    console.log('🔵 Store: Toggling barber status for ID:', id)
    
    // ✅ Get current barber to know current status
    const currentBarber = this.barbers.find(b => b.id === id)
    if (!currentBarber) {
      throw new Error('Barber not found in local state')
    }
    
    console.log(`   Current status: ${currentBarber.status}`)
    
    // ✅ Pass current status to service
    const updated = await barberService.toggleStatus(id, currentBarber.status)
    console.log('✅ Store: Barber updated:', updated)
    
    // Update in local state
    const index = this.barbers.findIndex(b => b.id === id)
    if (index !== -1) {
      this.barbers[index] = updated
    }

    if (this.currentBarber?.id === id) {
      this.currentBarber = updated
    }

    return updated
  } catch (error) {
    this.error = error.message
    console.error('❌ Store: Error toggling barber status:', error)
    throw error
  }
},
    async deleteBarber(id) {
      try {
        await this.toggleBarberStatus(id)
        if (this.currentBarber?.id === id) {
          this.currentBarber = null
        }
      } catch (error) {
        this.error = error.message
        console.error('Error deleting barber:', error)
        throw error
      }
    },

    /**
     * Fetch services for current barber
     */
    async fetchServices(barberId) {
      this.isLoadingServices = true
      this.error = null

      try {
        this.services = await serviceService.getByBarber(barberId)
      } catch (error) {
        this.error = error.message
        console.error('Error fetching services:', error)
        throw error
      } finally {
        this.isLoadingServices = false
      }
    },

    /**
     * Create service
     */
    async createService(data) {
      try {
        const newService = await serviceService.create(data)
        this.services.push(newService)
        return newService
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    /**
     * Update service
     */
    async updateService(id, data) {
      try {
        const updated = await serviceService.update(id, data)
        
        const index = this.services.findIndex(s => s.id === id)
        if (index !== -1) {
          this.services[index] = updated
        }

        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    /**
     * Toggle service status
     */
    async toggleServiceStatus(id) {
      try {
        await serviceService.toggleStatus(id)
        
        const service = this.services.find(s => s.id === id)
        if (service) {
          service.status = !service.status
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    /**
     * Set filters
     */
    setFilter(key, value) {
      this.filters[key] = value
    },

    /**
     * Reset filters
     */
    resetFilters() {
      this.filters = {
        search: '',
        status: 'all',
        area: 'all'
      }
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null
    }
  }
})