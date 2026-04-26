<template>
  <header
    id="main-header"
    class="sticky top-0 z-50 backdrop-blur-custom bg-slate-900/90 border-b border-slate-700/50"
  >
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="text-xl sm:text-2xl font-bold text-white font-mono"
          >AlexDevUwU</router-link
        >
        <nav class="flex items-center space-x-6 font-mono text-sm">
          <router-link
            to="/login"
            class="text-slate-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
          >
            <i class="fas fa-lock" v-if="!authStore.isAuthenticated && !authStore.isLoading"></i>
            <i
              class="fas fa-unlock text-green-400"
              v-else-if="authStore.isAuthenticated && !authStore.isLoading"
            ></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            .auth()
          </router-link>
          <button
            v-if="altLocale"
            @click="changeLang"
            class="text-slate-300 hover:text-blue-400 transition-colors duration-300"
          >
            .translate("{{ altLocale }}")
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLangStore } from '../stores/lang'
import { useAuthStore } from '../stores/auth'

const langStore = useLangStore()
const authStore = useAuthStore()

const altLocale = computed(() => (langStore.locale === 'es' ? 'en' : 'es'))

async function changeLang() {
  const newLocale = langStore.locale === 'es' ? 'en' : 'es'

  langStore.toggleLocale()

  window.dispatchEvent(
    new CustomEvent('language-changed', {
      detail: { locale: newLocale },
    }),
  )
}

onMounted(() => {
  authStore.checkAuth()
})
</script>

<script>
export default {
  name: 'HeaderComponent',
  mounted() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href').startsWith('#')) {
          e.preventDefault()
          const target = document.querySelector(this.getAttribute('href'))
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        }
      })
    })

    window.addEventListener('scroll', () => {
      const header = document.getElementById('main-header')
      if (window.scrollY > 50) {
        header.classList.add('bg-slate-900/95')
      } else {
        header.classList.remove('bg-slate-900/95')
      }
    })
  },
}
</script>
