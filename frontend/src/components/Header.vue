<template>
  <!-- Header -->
  <header
    id="main-header"
    class="sticky top-0 z-50 backdrop-blur-custom bg-slate-900/90 border-b border-slate-700/50"
  >
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl sm:text-2xl font-bold text-white font-mono">AlexDevUwU</h1>
        <nav class="flex space-x-6 font-mono text-sm">
          <a href="#about" class="text-slate-300 hover:text-blue-800 transition-colors duration-300"
            >.translate("en")</a
          >
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  mounted() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
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
