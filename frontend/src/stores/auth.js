import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  }),
  actions: {
    async checkAuth() {
      this.isLoading = true
      try {
        console.log('Checking authentication status...')
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        this.isAuthenticated = data.isAuthenticated
        this.user = data.username || null
      } catch (error) {
        console.error('Authentication check failed:', error)
        this.isAuthenticated = false
        this.user = null
      } finally {
        this.isLoading = false
      }
    },
    async logout(returnUrl = '/') {
      this.isLoading = true
      try {
        console.log('Attempting logout...')
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ returnUrl }),
        })
        const data = await response.json()
        this.isAuthenticated = data.isAuthenticated
        this.user = data.username || null
        return data
      } catch (error) {
        console.error('Logout failed:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
