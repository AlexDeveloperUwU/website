import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

export const useLangStore = defineStore('lang', {
  state: () => ({
    locale: localStorage.getItem('locale') || 'es',
  }),
  actions: {
    async setLocale(newLocale) {
      this.locale = newLocale
      localStorage.setItem('locale', newLocale)

      try {
        const { locale } = useI18n()
        locale.value = newLocale
      } catch (e) {
        console.error('Error updating i18n locale:', e)
      }
    },
    toggleLocale() {
      const newLocale = this.locale === 'es' ? 'en' : 'es'
      this.setLocale(newLocale)
    },
  },
})
