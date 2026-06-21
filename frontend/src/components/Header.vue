<template>
  <header
    id="main-header"
    class="sticky top-0 z-50 transition-all duration-75"
    :style="{
      backgroundColor: `rgba(15, 23, 42, ${Math.min(scrollRatio * 0.8, 0.8)})`,
      backdropFilter: `blur(${scrollRatio * 12}px)`,
      webkitBackdropFilter: `blur(${scrollRatio * 12}px)`,
      paddingTop: `${20 - scrollRatio * 8}px`,
      paddingBottom: `${20 - scrollRatio * 8}px`,
      boxShadow:
        scrollRatio > 0.1 ? `0 10px 15px -3px rgba(0, 0, 0, ${scrollRatio * 0.3})` : 'none',
    }"
  >
    <div class="container mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between">
        <router-link
          to="/"
          class="text-xl sm:text-2xl font-bold font-mono group flex items-center gap-2"
        >
          <span class="text-blue-500 group-hover:text-cyan-400 transition-colors">></span>
          <span class="text-white group-hover:gradient-text transition-all duration-300"
            >AlexDevUwU</span
          >
          <span class="animate-pulse text-blue-500">_</span>
        </router-link>

        <nav class="flex items-center space-x-4 sm:space-x-6 font-mono text-sm sm:text-base">
          <router-link
            :to="authStore.isAuthenticated ? '/dashboard' : { path: '/login' }"
            class="text-slate-300 hover:text-white transition-colors duration-300 flex items-center group"
          >
            <span class="syntax-function group-hover:text-cyan-400 transition-colors">.auth</span>
            <span class="text-slate-500">()</span>
          </router-link>

          <button
            v-if="altLocale"
            @click="changeLang"
            class="text-slate-300 hover:text-white transition-colors duration-300 flex items-center group"
          >
            <span class="syntax-function group-hover:text-cyan-400 transition-colors"
              >.translate</span
            >
            <span class="text-slate-500">(</span>
            <span class="syntax-string group-hover:text-green-400 transition-colors"
              >"{{ altLocale }}"</span
            >
            <span class="text-slate-500">)</span>
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLangStore } from '../stores/lang'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const langStore = useLangStore()
const authStore = useAuthStore()
const scrollRatio = ref(0)
let ticking = false

const altLocale = computed(() => (langStore.locale === 'es' ? 'en' : 'es'))

async function changeLang() {
  console.log('[Header] Language change event triggered')
  const newLocale = langStore.locale === 'es' ? 'en' : 'es'

  langStore.toggleLocale()

  window.dispatchEvent(
    new CustomEvent('language-changed', {
      detail: { locale: newLocale },
    }),
  )
}

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      scrollRatio.value = Math.min(window.scrollY / 100, 1)
      ticking = false
    })
    ticking = true
  }
}

const initSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href')
      if (href.startsWith('#')) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          console.log(`[Header] Directing scroll anchor frame to ${href}`)
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    })
  })
}

onMounted(() => {
  console.log('[Header] Frame animation system initialized with route parameters')
  authStore.checkAuth()
  window.addEventListener('scroll', handleScroll, { passive: true })
  scrollRatio.value = Math.min(window.scrollY / 100, 1)
  initSmoothScrolling()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
