<template>
  <main class="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
    <div class="card-hover code-block rounded-xl relative overflow-hidden w-full max-w-md">
      <div class="linux-titlebar">
        <span class="text-white font-mono text-xs">~/auth/login.cs</span>
        <window-controls />
      </div>

      <div class="p-8 text-center">
        <div
          class="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg mb-6"
        >
          <i class="fab fa-discord text-white text-4xl"></i>
        </div>

        <h2 class="text-2xl font-bold text-white mb-2 font-mono">System.Authenticate()</h2>
        <p class="text-slate-400 mb-8 font-mono text-sm">{{ $t('pages.login.description') }}</p>

        <div v-if="authStore.isLoading" class="text-slate-400 font-mono py-4">
          Loading system resources...
        </div>

        <div v-else-if="authStore.isAuthenticated" class="space-y-6">
          <p
            class="text-green-400 font-mono bg-slate-800/50 py-3 rounded-lg border border-green-400/20"
          >
            Logged in as: <span class="font-bold">{{ authStore.user }}</span>
          </p>
          <button
            @click="logout"
            class="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 font-mono border border-slate-500"
          >
            <i class="fas fa-sign-out-alt mr-2"></i> Session.Logout()
          </button>
        </div>

        <div v-else>
          <button
            @click="loginWithDiscord"
            class="block w-full bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#3c45a5] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] font-mono shadow-lg shadow-[#5865F2]/20"
          >
            <i class="fab fa-discord mr-2"></i> Discord.Login()
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const getTargetRoute = () => {
  const fallback = route.query.returnUrl
  return fallback && fallback !== '/' ? fallback : '/dashboard'
}

const loginWithDiscord = () => {
  const target = getTargetRoute()
  console.log(`[Auth] Redirecting to external auth provider. Return target: ${target}`)

  const currentOrigin = window.location.origin
  const externalAuthUrl = `http://localhost:5187/api/auth/login?returnUrl=${encodeURIComponent(currentOrigin + target)}`

  window.location.href = externalAuthUrl
}

const logout = () => {
  console.log('[Auth] Redirecting to backend logout endpoint')
  window.location.href =
    'http://localhost:5187/api/auth/logout?returnUrl=' + encodeURIComponent(window.location.origin)
}

onMounted(async () => {
  await authStore.checkAuth()
  if (authStore.isAuthenticated) {
    const target = getTargetRoute()
    console.log(`[Auth] Session active, forward routing execution to: ${target}`)
    router.push(target)
  }
})

watch(
  () => authStore.isAuthenticated,
  (newVal) => {
    if (newVal) {
      const target = getTargetRoute()
      console.log(`[Auth] Authentication state true, changing view matrix to: ${target}`)
      router.push(target)
    }
  },
)
</script>
