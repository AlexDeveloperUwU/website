<template>
  <main class="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
    <div class="card-hover code-block rounded-xl relative overflow-hidden w-full max-w-md">
      <div class="linux-titlebar">
        <span class="text-white font-mono text-xs">~/auth/login.cs</span>
        <div class="linux-controls">
          <div class="linux-btn linux-btn-minimize flex items-center justify-center text-xs font-bold text-slate-600">−</div>
          <div class="linux-btn linux-btn-maximize flex items-center justify-center text-xs font-bold text-slate-600">□</div>
          <div class="linux-btn linux-btn-close flex items-center justify-center text-xs font-bold text-slate-600">×</div>
        </div>
      </div>

      <div class="p-8 text-center">
        <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg mb-6">
          <i class="fab fa-discord text-white text-4xl"></i>
        </div>

        <h2 class="text-2xl font-bold text-white mb-2 font-mono">System.Authenticate()</h2>
        <p class="text-slate-400 mb-8 font-mono text-sm">{{ $t('pages.login.description') }}</p>

        <div v-if="authStore.isLoading" class="text-slate-400 font-mono py-4">
          Loading system resources...
        </div>
        <div v-else-if="authStore.isAuthenticated" class="space-y-6">
          <p class="text-green-400 font-mono bg-slate-800/50 py-3 rounded-lg border border-green-400/20">
            Logged in as: <span class="font-bold">{{ authStore.user }}</span>
          </p>
          <a href="/api/auth/logout" class="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 font-mono border border-slate-500">
            <i class="fas fa-sign-out-alt mr-2"></i> Session.Logout()
          </a>
        </div>
        <div v-else>
          <a href="/api/auth/login" class="block w-full bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#3c45a5] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] font-mono shadow-lg shadow-[#5865F2]/20">
            <i class="fab fa-discord mr-2"></i> Discord.Login()
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>
