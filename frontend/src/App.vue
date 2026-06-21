<template>
  <div class="app-bg text-white font-sans">
    <header-component />
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in" appear>
        <component :is="Component" :key="viewKey" />
      </Transition>
    </router-view>
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
  },
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLangStore } from './stores/lang'
import { useAuthStore } from './stores/auth'

const { t, locale } = useI18n()
const langStore = useLangStore()
const authStore = useAuthStore()

locale.value = langStore.locale

const viewKey = ref(0)

function handlePageShow(event) {
  if (event.persisted) {
    authStore.checkAuth()
    viewKey.value++
  }
}

onMounted(() => window.addEventListener('pageshow', handlePageShow))
onUnmounted(() => window.removeEventListener('pageshow', handlePageShow))
</script>
