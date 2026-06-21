<template>
  <main class="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
    <div class="card-hover code-block rounded-xl relative overflow-hidden w-full max-w-md">
      <div class="linux-titlebar">
        <span class="text-white font-mono text-xs">~/dashboard/index.cs</span>
        <window-controls />
      </div>

      <div class="p-8 text-center">
        <div
          class="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mb-6"
        >
          <i class="fas fa-user-shield text-white text-4xl"></i>
        </div>

        <h2 class="text-2xl font-bold text-white mb-2 font-mono">System.Dashboard()</h2>
        <p class="text-slate-400 mb-8 font-mono text-sm">Welcome back to the secure environment.</p>

        <div v-if="authStore.isLoading" class="text-slate-400 font-mono py-4">
          Loading system resources...
        </div>
        <div v-else-if="authStore.isAuthenticated" class="space-y-6">
          <p
            class="text-green-400 font-mono bg-slate-800/50 py-3 rounded-lg border border-green-400/20"
          >
            Logged in as: <span class="font-bold">{{ authStore.user }}</span>
          </p>
          <form action="/api/auth/logout?returnUrl=/" method="post" class="block w-full">
            <button
              type="submit"
              class="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 font-mono border border-slate-500 shadow-lg"
            >
              <i class="fas fa-sign-out-alt mr-2"></i> Session.Logout()
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await authStore.checkAuth()
  if (!authStore.isAuthenticated && !authStore.isLoading) {
    router.push('/login')
  }
})

watch(
  () => authStore.isAuthenticated,
  (newVal) => {
    if (!newVal && !authStore.isLoading) {
      router.push('/login')
    }
  },
)
</script>
