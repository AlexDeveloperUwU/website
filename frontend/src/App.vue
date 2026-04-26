<template>
  <div class="app-bg text-white font-sans">
    <header-component />
    <router-view />
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
import { useI18n } from 'vue-i18n'
import { useLangStore } from './stores/lang'
const { t, locale } = useI18n()
const langStore = useLangStore()

locale.value = langStore.locale
</script>
