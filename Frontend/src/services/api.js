import cookieAuth from '../utils/cookieAuth'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_FALLBACK_API_URL ||
  'https://veyg-2k25-backend.onrender.com';

// API Base URL configured


class ApiService {
  // Helper method to get auth headers
  getAuthHeaders() {
    const authData = cookieAuth.getAuthData()
    return {
      'Content-Type': 'application/json',
      ...(authData?.token && { 'Authorization': `Bearer ${authData.token}` })
    }
  }

  // Helper method for API requests with performance optimization
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // Reduced timeout for better performance

    const config = {
      headers: this.getAuthHeaders(),
      signal: controller.signal,
      ...options
    }

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Server returned invalid response (${response.status}). The backend may be down or the URL may be incorrect.`)
      }

      const data = await response.json()

      if (!response.ok) {
        // Handle different error response formats
        let errorMessage = `HTTP error! status: ${response.status}`

        if (data) {
          if (typeof data === 'string') {
            errorMessage = data
          } else if (data.message) {
            if (typeof data.message === 'string') {
              errorMessage = data.message
            } else if (data.message.message) {
              // Handle nested error objects
              errorMessage = data.message.message
            } else if (data.message.existingRegistration) {
              // Handle day-wise registration errors
              errorMessage = `${data.message.message || 'Registration failed'}`
              if (data.message.existingRegistration.gameName) {
                errorMessage += ` You are already registered for "${data.message.existingRegistration.gameName}".`
              }
            }
          } else if (data.error) {
            errorMessage = data.error
          }
        }

        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.')
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network connection error. The backend server may be down. Please try again later.')
      }

      throw error
    }
  }

  // Health check API
  async healthCheck() {
    return this.request('/health')
  }

  // Authentication APIs
  async studentLogin(credentials) {
    return this.request('/student/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  async studentRegister(userData) {
    return this.request('/student/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async adminLogin(credentials) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  async adminRegister(userData) {
    return this.request('/admin/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  // Profile APIs
  async getUserProfile() {
    return this.request('/user/profile')
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    })
  }

  async getAdminProfile() {
    return this.request('/admin/profile')
  }

  async updateAdminProfile(profileData) {
    return this.request('/admin/update-profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    })
  }

  async changeAdminPassword(passwordData) {
    return this.request('/admin/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData)
    })
  }

  // Game Registration APIs
  async registerForGame(registrationData) {
    return this.request('/game-registrations/register', {
      method: 'POST',
      body: JSON.stringify(registrationData)
    })
  }

  async getMyRegistrations() {
    return this.request('/game-registrations/my-registrations')
  }

  async getAllRegistrations() {
    return this.request('/game-registrations/all')
  }

  async updateRegistrationStatus(registrationId, statusData) {
    return this.request(`/game-registrations/${registrationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData)
    })
  }

  // Day-wise registration APIs
  async getDayWiseRegistrationStatus() {
    return this.request('/game-registrations/day-wise-status')
  }

  async checkDayAvailability(day) {
    return this.request(`/game-registrations/check-day/${day}`)
  }

  async getDayWiseStats() {
    return this.request('/game-registrations/day-wise-stats')
  }

  async getPublicStats() {
    return this.request('/game-registrations/day-wise-stats')
  }

  async deleteRegistration(registrationId) {
    return this.request(`/game-registrations/${registrationId}`, {
      method: 'DELETE'
    })
  }


  // Utility method to verify token validity
  async verifyToken() {
    try {
      const authData = cookieAuth.getAuthData()
      if (!authData) return null

      // Try to fetch profile to verify token
      if (authData.isAdmin) {
        const result = await this.getAdminProfile()
        return result.data
      } else {
        const result = await this.getUserProfile()
        return result.data
      }
    } catch (error) {
      // Token is invalid, clear it
      cookieAuth.clearAuthData()
      return null
    }
  }
}

export default new ApiService()
