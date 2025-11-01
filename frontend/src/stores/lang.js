import { defineStore } from 'pinia'

export const useLangStore = defineStore('lang', {
  state: () => ({
    locale: localStorage.getItem('locale') || 'es',
  }),
  actions: {
    async setLocale(newLocale) {
      this.locale = newLocale
      localStorage.setItem('locale', newLocale)
    },
    toggleLocale() {
      const newLocale = this.locale === 'es' ? 'en' : 'es'
      this.setLocale(newLocale)
    },
  },
})
