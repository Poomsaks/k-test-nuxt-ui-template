// stores/auth/state.ts
import { defineStore } from 'pinia'

interface OptionsData {
  [key: string]: any
}

interface StateStore {
  options: OptionsData | null
  loading: boolean
  error: string | null
}

export const useStateStore = defineStore('state', {
  state: (): StateStore => ({
    options: null,
    loading: false,
    error: null
  }),

  getters: {
    hasOptions: state => !!state.options,
    getOptionValue: state => (key: string) => state.options?.[key] || null
  },

  actions: {
    setOptions(optionsData: OptionsData) {
      this.options = optionsData
      this.error = null
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    clearOptions() {
      this.options = null
      this.error = null
    }
  },

  persist: {
    storage: import.meta.client ? sessionStorage : undefined,
    key: 'state-store',
    paths: ['options']
  }
})
