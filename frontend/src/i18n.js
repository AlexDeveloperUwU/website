import { createI18n } from 'vue-i18n'

function loadLocaleMessages() {
  const messages = {}
  const localeFiles = import.meta.glob('../locales/**/*.json', { eager: true })

  for (const path in localeFiles) {
    const match = path.match(/\/locales\/([a-z0-9-_]+)\/(pages|components)\/(.+)\.json$/i)
    if (!match) continue

    const locale = match[1]
    const section = match[2]
    const keyPath = match[3]

    if (!messages[locale]) {
      messages[locale] = {}
    }
    if (!messages[locale][section]) {
      messages[locale][section] = {}
    }

    messages[locale][section][keyPath] = localeFiles[path].default
  }

  console.log('Loaded messages with correct structure:', messages)
  return messages
}

let i18n

function createI18nInstance(initialLocale = 'es') {
  const messages = loadLocaleMessages()
  i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: 'es',
    messages,
  })

  return i18n
}

export { createI18nInstance, i18n }
