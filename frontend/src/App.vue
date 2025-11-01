<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans">
    <header-component />
    <home-view />
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue'
import HomeView from './views/HomeView.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    HomeView,
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

<style>
.gradient-text {
  background: linear-gradient(135deg, #1e40af, #0369a1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-hover {
  transition:
    box-shadow 1.8s cubic-bezier(0.19, 1, 0.22, 1),
    background-color 1.8s cubic-bezier(0.19, 1, 0.22, 1),
    border-color 1.8s cubic-bezier(0.19, 1, 0.22, 1),
    transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-hover:hover {
  box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.15);
}

.tech-badge {
  transition: all 0.3s ease;
}

.tech-badge:hover {
  transform: scale(1.05);
}

.backdrop-blur-custom {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.section-divider {
  position: relative;
  margin: 3rem 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(59, 77, 105, 0.4), transparent);
}

.section-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg,
      transparent,
      rgba(30, 64, 175, 0.6),
      rgba(3, 105, 161, 0.6),
      transparent);
}

.section-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #1e40af;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(30, 64, 175, 0.4);
}

.code-block {
  background: linear-gradient(135deg, #151e2c 0%, #111827 100%);
  border: 1px solid #2d3a54;
  position: relative;
}

.linux-titlebar {
  background: #2c394f;
  border-bottom: 1px solid #3b4d69;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-radius: 8px 8px 0 0;
}

.linux-controls {
  display: flex;
  gap: 8px;
}

.linux-btn {
  width: 12px;
  height: 12px;
  background: #4a5b7a;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.linux-btn:hover {
  background: #6a7c9e;
}

.linux-btn-minimize {
  background: #fbbf24;
}

.linux-btn-maximize {
  background: #10b981;
}

.linux-btn-close {
  background: #ef4444;
}

.syntax-comment {
  color: #6d7e96;
}

.syntax-keyword {
  color: #1e40af;
}

.syntax-string {
  color: #10b981;
}

.syntax-function {
  color: #f59e0b;
}

.syntax-variable {
  color: #ec4899;
}
</style>
