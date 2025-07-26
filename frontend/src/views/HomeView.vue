<template>
  <main class="container mx-auto px-2 sm:px-4 py-6">
    <section>
      <div class="max-w-6xl mx-auto">
        <div class="text-center space-y-4 mb-8">
          <h3
            class="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-3 font-mono"
          >
            <i class="fas fa-user text-blue-800"></i>
            <span class="syntax-comment">// </span>Sobre mí
          </h3>
          <p class="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            <span class="syntax-comment">/* Conóceme un poco más! */</span>
          </p>
        </div>
        <div class="card-hover code-block rounded-xl relative overflow-hidden">
          <div class="linux-titlebar flex items-center justify-between px-3 py-2">
            <span class="text-white font-mono text-xs">~/portfolio/developer.js</span>
            <div class="linux-controls flex gap-1">
              <div
                class="linux-btn linux-btn-minimize flex items-center justify-center text-xs font-bold text-slate-600"
              >
                −
              </div>
              <div
                class="linux-btn linux-btn-maximize flex items-center justify-center text-xs font-bold text-slate-600"
              >
                □
              </div>
              <div
                class="linux-btn linux-btn-close flex items-center justify-center text-xs font-bold text-slate-600"
              >
                ×
              </div>
            </div>
          </div>

          <div class="p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <div
                class="w-full sm:w-1/4 bg-slate-800/50 p-4 rounded-lg flex flex-col items-center text-center gap-1"
              >
                <div class="p-1 rounded-full shadow-inner bg-slate-900/60">
                  <div
                    id="profileImage"
                    class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl ring-4 ring-offset-2 ring-offset-slate-900 overflow-hidden aspect-square"
                    style="
                      --tw-ring-color: rgb(234 179 8);
                      box-shadow: rgba(234, 179, 8, 0.5) 0px 0px 0px 4px;
                      border-color: rgb(234, 179, 8);
                      outline: rgb(234, 179, 8) solid 2px;
                      transition:
                        box-shadow 0.5s,
                        border-color 0.5s,
                        outline 0.5s;
                    "
                  >
                    <img
                      src="https://alexdevuwu.com/img/logoSmall.webp"
                      alt="Alex Verde"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h2 class="text-xl font-bold text-white leading-tight">Alex Verde</h2>
                <span class="font-mono text-blue-400 text-sm select-all">@alexdevuwu</span>
              </div>

              <div class="flex-1 flex flex-col gap-4">
                <div class="flex flex-wrap gap-4 justify-between">
                  <div
                    class="flex-1 min-w-[140px] bg-slate-800/50 p-4 rounded-lg flex flex-col items-center"
                  >
                    <div class="flex items-center gap-2 mb-2 text-blue-500">
                      <i class="fas fa-mug-hot"></i>
                      <span class="text-slate-300">Estado actual</span>
                    </div>
                    <span class="text-yellow-400 font-medium text-lg">
                      <i class="fas fa-circle mr-2"></i> Away
                    </span>
                  </div>

                  <div
                    class="flex-1 min-w-[140px] bg-slate-800/50 p-4 rounded-lg flex flex-col items-center"
                  >
                    <div class="flex items-center gap-2 mb-2 text-blue-500">
                      <i class="fas fa-clock"></i>
                      <span class="text-slate-300">Experiencia</span>
                    </div>
                    <span class="text-white font-medium text-lg">3+ años</span>
                  </div>
                </div>

                <div class="flex flex-wrap gap-4 justify-between">
                  <div
                    class="flex-1 min-w-[140px] bg-slate-800/50 p-4 rounded-lg flex flex-col items-center"
                  >
                    <div class="flex items-center gap-2 mb-2 text-blue-500">
                      <i class="fas fa-coffee"></i>
                      <span class="text-slate-300">Café consumido</span>
                    </div>
                    <span class="text-white font-medium text-lg">1770 tazas</span>
                  </div>

                  <div
                    class="flex-1 min-w-[140px] bg-slate-800/50 p-4 rounded-lg flex flex-col items-center"
                  >
                    <div class="flex items-center gap-2 mb-2 text-blue-500">
                      <i class="fas fa-terminal"></i>
                      <span class="text-slate-300">Proyecto actual</span>
                    </div>
                    <span class="text-white font-medium text-lg">LiberTeis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-hover code-block rounded-xl mt-6 relative overflow-hidden">
          <div class="linux-titlebar">
            <span class="text-white font-mono text-xs sm:text-sm">~/about/bio.md</span>
            <div class="linux-controls">
              <div
                class="linux-btn linux-btn-minimize flex items-center justify-center text-xs font-bold text-slate-600"
              >
                −
              </div>
              <div
                class="linux-btn linux-btn-maximize flex items-center justify-center text-xs font-bold text-slate-600"
              >
                □
              </div>
              <div
                class="linux-btn linux-btn-close flex items-center justify-center text-xs font-bold text-slate-600"
              >
                ×
              </div>
            </div>
          </div>

          <div class="p-4 sm:p-6">
            <div class="flex flex-col lg:flex-row gap-6 items-start">
              <div class="w-full lg:w-1/3 mb-4 lg:mb-0">
                <div class="code-block rounded-xl p-4 border border-slate-600/50">
                  <img
                    src="https://i.ibb.co/FbSDvtgv/20241223-121455-1-VSee-Face.png"
                    alt="Alex Verde Character"
                    class="w-full h-40 sm:h-48 rounded-lg object-cover object-center"
                  />
                </div>
              </div>
              <div class="w-full lg:w-2/3">
                <h3
                  class="text-base sm:text-xl font-semibold text-white mb-4 flex items-center gap-2"
                >
                  <i class="fas fa-user text-blue-800"></i>
                  Sobre mí
                </h3>
                <div class="space-y-4 text-slate-200 leading-relaxed text-sm sm:text-base">
                  <p>
                    ¡Hola! Soy Alex, un apasionado programador, gamer y streamer en mi tiempo libre.
                    Principalmente desarrollo páginas web y despliego servidores de diversos tipos,
                    aunque también he creado aplicaciones de escritorio.
                  </p>
                  <p>
                    Tengo una especial afición por experimentar con Node.js y otras tecnologías.
                    Paso muchas horas en mi ordenador, trabajando en varios proyectos, siempre
                    acompañado de mi café y mi entusiasmo por aprender y descubrir cosas nuevas!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="section-divider"></div>

    <section id="projects">
      <div class="max-w-6xl mx-auto">
        <div class="text-center space-y-4 mb-8">
          <h3
            class="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-3 font-mono"
          >
            <i class="fab fa-github text-blue-800"></i>
            <span class="syntax-comment">// </span>Proyectos
          </h3>
          <p class="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            <span class="syntax-comment">/* Una selección de mis proyectos más destacados */</span>
          </p>
        </div>
        <div v-if="loadingProjects" class="text-center text-slate-400 py-8 font-mono">
          Cargando proyectos...
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" id="projects-container">
          <template v-for="(project, index) in projects" :key="project.name">
            <div
              class="card-hover code-block rounded-xl group relative overflow-hidden"
              :data-project-index="index"
              :data-project-id="project.name.replace(/\s+/g, '-').toLowerCase()"
            >
              <div class="linux-titlebar">
                <span class="text-white font-mono text-xs project-path">
                  ~/projects/{{ project.org.replace(/\s+/g, '').toLowerCase() }}/{{
                    project.name.replace(/\s+/g, '-').toLowerCase()
                  }}
                </span>
                <div class="linux-controls">
                  <div
                    class="linux-btn linux-btn-minimize flex items-center justify-center text-xs font-bold text-slate-600"
                  >
                    −
                  </div>
                  <div
                    class="linux-btn linux-btn-maximize flex items-center justify-center text-xs font-bold text-slate-600"
                  >
                    □
                  </div>
                  <div
                    class="linux-btn linux-btn-close flex items-center justify-center text-xs font-bold text-slate-600"
                  >
                    ×
                  </div>
                </div>
              </div>
              <div class="p-4 sm:p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 to-blue-700 flex items-center justify-center shadow-lg"
                    >
                      <i :class="project.icon + ' text-white project-icon'"></i>
                    </div>
                    <h4
                      class="text-lg sm:text-xl font-semibold text-white group-hover:text-blue-300 transition-colors font-mono project-name"
                    >
                      {{ project.name }}
                    </h4>
                  </div>
                  <a
                    v-if="project.url"
                    :href="project.url"
                    class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white project-url"
                    target="_blank"
                    rel="noopener"
                  >
                    <i class="fas fa-external-link-alt"></i>
                  </a>
                </div>
                <p
                  class="text-slate-300 leading-relaxed mb-4 text-xs sm:text-sm project-description"
                >
                  {{ project.description }}
                </p>
                <div class="flex flex-wrap gap-2 project-techs">
                  <span
                    v-for="tech in project.tech"
                    :key="tech"
                    class="border border-slate-600 text-slate-200 hover:bg-slate-700 px-2 py-1 rounded text-xs font-mono transition-colors"
                    >{{ tech }}</span
                  >
                </div>
              </div>
            </div>
          </template>
        </div>

        <div
          class="card-hover code-block rounded-xl hover:bg-slate-800/70 transition-all duration-300 relative overflow-hidden"
        >
          <div class="linux-titlebar">
            <span class="text-white font-mono text-xs">~/projects/explore</span>
            <div class="linux-controls">
              <div
                class="linux-btn linux-btn-minimize flex items-center justify-center text-xs font-bold text-slate-600"
              >
                −
              </div>
              <div
                class="linux-btn linux-btn-maximize flex items-center justify-center text-xs font-bold text-slate-600"
              >
                □
              </div>
              <div
                class="linux-btn linux-btn-close flex items-center justify-center text-xs font-bold text-slate-600"
              >
                ×
              </div>
            </div>
          </div>
          <div class="p-4 sm:p-6">
            <a href="https://github.com/AlexDeveloperUwU" class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 to-blue-700 flex items-center justify-center shadow-lg"
              >
                <i class="fab fa-github text-white text-xl"></i>
              </div>
              <div class="flex-1">
                <h4 class="text-base sm:text-lg font-semibold text-white font-mono">
                  GitHub.explore()
                </h4>
                <p class="text-slate-300 font-mono text-xs sm:text-sm">
                  ¿Quieres ver otros proyectos que tengo? ¡Pásate por mi GitHub!
                </p>
              </div>
              <div class="text-slate-400">
                <i class="fas fa-arrow-right text-xl"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <div class="section-divider"></div>

    <section id="contact">
      <div class="max-w-6xl mx-auto">
        <div class="text-center space-y-4 mb-8">
          <h3
            class="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-3 font-mono"
          >
            <i class="fas fa-envelope text-blue-800"></i>
            <span class="syntax-comment">// </span>¿Trabajamos juntos?
          </h3>
          <p class="text-slate-300 max-w-2xl mx-auto font-mono text-sm">
            <span class="syntax-comment"
              >/* Siempre estoy abierto a nuevos proyectos y colaboraciones */</span
            >
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Email Contact -->
          <div
            id="copyEmail"
            class="card-hover code-block rounded-xl cursor-pointer relative overflow-hidden"
          >
            <div class="linux-titlebar">
              <span class="text-white font-mono text-xs">~/contact/email.js</span>
              <div class="linux-controls">
                <div
                  class="linux-btn linux-btn-minimize flex items-center justify-center text-xs font-bold text-slate-600"
                >
                  −
                </div>
                <div
                  class="linux-btn linux-btn-maximize flex items-center justify-center text-xs font-bold text-slate-600"
                >
                  □
                </div>
                <div
                  class="linux-btn linux-btn-close flex items-center justify-center text-xs font-bold text-slate-600"
                >
                  ×
                </div>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 to-blue-700 flex items-center justify-center shadow-lg"
                >
                  <i class="fas fa-envelope text-white text-xl"></i>
                </div>
                <div>
                  <h4 class="text-base sm:text-lg font-semibold text-white font-mono">
                    Contact.sendEmail()
                  </h4>
                  <p class="text-slate-200 font-mono text-xs sm:text-sm">
                    Haz clic para copiar mi dirección
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Discord Contact -->
          <div
            id="copyDiscord"
            class="card-hover code-block rounded-xl cursor-pointer relative overflow-hidden"
          >
            <div class="linux-titlebar">
              <span class="text-white font-mono text-xs">~/contact/discord.js</span>
              <div class="linux-controls">
                <div
                  class="linux-btn linux-btn-minimize flex items-center justify-center text-xs font-bold text-slate-600"
                >
                  −
                </div>
                <div
                  class="linux-btn linux-btn-maximize flex items-center justify-center text-xs font-bold text-slate-600"
                >
                  □
                </div>
                <div
                  class="linux-btn linux-btn-close flex items-center justify-center text-xs font-bold text-slate-600"
                >
                  ×
                </div>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 to-blue-700 flex items-center justify-center shadow-lg"
                >
                  <i class="fab fa-discord text-white text-xl"></i>
                </div>
                <div>
                  <h4 class="text-base sm:text-lg font-semibold text-white font-mono">
                    Contact.sendMessage()
                  </h4>
                  <p class="text-slate-200 font-mono text-xs sm:text-sm">
                    Haz clic para copiar mi usuario
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form - Full Width -->
        <div class="code-block rounded-xl relative overflow-hidden">
          <div class="linux-titlebar">
            <span class="text-white font-mono text-xs">~/contact/form.js</span>
            <div class="linux-controls">
              <div
                class="linux-btn linux-btn-minimize flex items-center justify-center text-xs font-bold text-slate-600"
              >
                −
              </div>
              <div
                class="linux-btn linux-btn-maximize flex items-center justify-center text-xs font-bold text-slate-600"
              >
                □
              </div>
              <div
                class="linux-btn linux-btn-close flex items-center justify-center text-xs font-bold text-slate-600"
              >
                ×
              </div>
            </div>
          </div>
          <div class="p-4 sm:p-6">
            <h4
              class="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-3 font-mono"
            >
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 to-blue-700 flex items-center justify-center shadow-lg"
              >
                <i class="fas fa-paper-plane text-white"></i>
              </div>
              Contact.sendRequest()
            </h4>
            <form id="contactForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-semibold text-slate-200 mb-2 font-mono"
                  >const name =</label
                >
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-800 focus:ring-2 focus:ring-blue-800/20 focus:outline-none transition-all duration-300 font-mono"
                  placeholder='"Tu nombre aquí"'
                  required
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-semibold text-slate-200 mb-2 font-mono"
                  >const email =</label
                >
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-800 focus:ring-2 focus:ring-blue-800/20 focus:outline-none transition-all duration-300 font-mono"
                  placeholder='"tu@email.com"'
                  required
                />
              </div>
              <div class="md:col-span-2">
                <label
                  for="message"
                  class="block text-sm font-semibold text-slate-200 mb-2 font-mono"
                  >const message =</label
                >
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-800/20 focus:outline-none transition-all duration-300 resize-none font-mono"
                  placeholder='"Escribe aquí tu mensaje..."'
                  maxlength="3584"
                  required
                ></textarea>
              </div>
              <div class="md:col-span-2">
                <button
                  type="submit"
                  class="w-full bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform font-mono"
                >
                  <i class="fas fa-paper-plane mr-2"></i>
                  Contact.sendData()
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchDiscordStatus, getBorderColor, getStatus } from '@/assets/js/discord.js'
import { fetchProjects } from '@/assets/js/loadProjects.js'
import { useLangStore } from '@/stores/lang.js'

export default {
  name: 'HomeView',
  setup() {
    const { t, locale } = useI18n()
    const langStore = useLangStore()

    const discordStatus = ref('online')
    const discordStatusStyle = ref({ color: '#22c55e' })
    const projects = ref([])
    const loadingProjects = ref(true)

    const coffeeCups = computed(() => {
      const start = new Date(2018, 8, 11)
      const now = new Date()
      const msPerWeek = 1000 * 60 * 60 * 24 * 7
      const weeks = Math.floor((now - start) / msPerWeek)
      return weeks * 5
    })

    const discordStatusText = computed(() => t(getStatus(discordStatus.value)))

    let _discordInterval

    async function setDiscordStatus(status) {
      discordStatus.value = status
      const colorMap = {
        online: '#22c55e',
        idle: '#eab308',
        dnd: '#ef4444',
        offline: '#64748b',
        unknown: '#2563eb',
      }
      discordStatusStyle.value = {
        color: colorMap[status] || colorMap.unknown,
        transition: 'color 0.5s',
      }
      const borderColor = getBorderColor(status)
      const profileImage = document.getElementById('profileImage')
      if (profileImage) {
        profileImage.style.boxShadow = `0 0 0 4px ${borderColor}80`
        profileImage.style.borderColor = borderColor
        profileImage.style.outline = `2px solid ${borderColor}`
        profileImage.style.transition = 'box-shadow 0.5s, border-color 0.5s, outline 0.5s'
      }
    }

    async function loadProjects(lang) {
      loadingProjects.value = true
      try {
        const localeToUse = lang || locale.value || 'es'
        projects.value = await fetchProjects(localeToUse)
        window.__projects = projects.value
      } catch (e) {
        projects.value = []
      }
      loadingProjects.value = false
    }

    async function updateProjectDescriptions(lang) {
      try {
        const localeToUse = lang || locale.value || 'es'
        const translatedProjects = await fetchProjects(localeToUse)
        projects.value.forEach((proj, idx) => {
          if (translatedProjects[idx]) {
            proj.name = translatedProjects[idx].name
            proj.description = translatedProjects[idx].description
          }
        })
      } catch (e) {}
    }

    async function updateStatus() {
      try {
        const status = await fetchDiscordStatus()
        await setDiscordStatus(status)
      } catch (e) {
        await setDiscordStatus('offline')
      }
    }

    function addCopyListeners() {
      const emailBtn = document.getElementById('copyEmail')
      if (emailBtn) {
        emailBtn.addEventListener('click', async () => {
          const email = 'alex@alexdevuwu.com'
          try {
            await navigator.clipboard.writeText(email)
            alert('¡Email copiado al portapapeles!')
          } catch (err) {
            console.error('Error copying email:', err)
            alert('Error al copiar el email')
          }
        })
      }

      const discordBtn = document.getElementById('copyDiscord')
      if (discordBtn) {
        discordBtn.addEventListener('click', async () => {
          const discord = 'alexdevuwu'
          try {
            await navigator.clipboard.writeText(discord)
            alert('¡Usuario de Discord copiado!')
          } catch (err) {
            console.error('Error copying Discord:', err)
            alert('Error al copiar el usuario')
          }
        })
      }
    }

    function addContactFormListener() {
      const form = document.getElementById('contactForm')
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
          }
          console.log('Form data:', data)
          alert('¡Mensaje enviado correctamente!')
          e.target.reset()
        })
      }
    }

    function addScrollHeaderListener() {
      window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header')
        if (header) {
          if (window.scrollY > 50) {
            header.classList.add('bg-slate-900/95')
          } else {
            header.classList.remove('bg-slate-900/95')
          }
        }
      })
    }

    function addCardObserver() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
      const observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
          }
        })
      }, observerOptions)

      document.querySelectorAll('.card-hover').forEach((card) => {
        card.style.opacity = '0'
        card.style.transform = 'translateY(20px)'
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        observer.observe(card)
      })
    }

    function addProjectsUpdatedListener() {
      window.addEventListener('projects-updated', (event) => {
        if (event.detail && event.detail.projects) {
          const translatedProjects = event.detail.projects
          projects.value.forEach((proj, idx) => {
            if (translatedProjects[idx]) {
              proj.name = translatedProjects[idx].name
              proj.description = translatedProjects[idx].description
            }
          })
        }
      })
    }

    onMounted(async () => {
      await updateStatus()
      _discordInterval = setInterval(updateStatus, 30000)

      await loadProjects(locale.value)

      langStore.$subscribe(async (_, state) => {
        locale.value = state.locale
        await updateProjectDescriptions(state.locale)
      })

      addCopyListeners()
      addContactFormListener()
      addScrollHeaderListener()
      addCardObserver()
      addProjectsUpdatedListener()
    })

    return {
      discordStatus,
      discordStatusStyle,
      projects,
      loadingProjects,
      coffeeCups,
      discordStatusText,
      setDiscordStatus,
      loadProjects,
    }
  },
}
</script>
