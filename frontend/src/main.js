import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createI18nInstance } from './i18n.js'
import { useLangStore } from './stores/lang.js'

const app = createApp(App)

app.use(createPinia())

const langStore = useLangStore()
const initialLocale = langStore.locale

const i18n = createI18nInstance(initialLocale)

app.use(router)
app.use(i18n)

app.mount('#app')