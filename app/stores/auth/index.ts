// stores/auth/index.ts
import { defineStore } from 'pinia'
import type { UserData } from '~/types'

interface AuthState {
  isAuthenticated: boolean
  user: UserData | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null
  }),

  getters: {
    isLoggedIn: state => state.isAuthenticated && !!state.user,
    userRole: state => state.user?.role || '',
    userPermissions: state => state.user?.permissions || [],
    userDistricts: state => state.user?.districts || []
  },

  actions: {
    setAuthenticated(authenticated: boolean) {
      this.isAuthenticated = authenticated
    },

    setUser(userData: UserData) {
      this.user = userData
      this.isAuthenticated = true
    },

    logout() {
      this.isAuthenticated = false
      this.user = null
    },

    updateToken(token: string, refreshToken?: string) {
      if (this.user) {
        this.user.token = token
        if (refreshToken) {
          this.user.refreshToken = refreshToken
        }
      }
    }
  },

  persist: {
    storage: import.meta.client ? localStorage : undefined,
    key: 'auth-store',
    paths: ['isAuthenticated', 'user']
  }
})
