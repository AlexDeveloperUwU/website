import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createI18nInstance } from './i18n.js'

const app = createApp(App)

const i18n = createI18nInstance()

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
