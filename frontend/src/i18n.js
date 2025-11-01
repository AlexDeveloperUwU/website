import { createI18n } from 'vue-i18n'

function loadLocaleMessages() {
  const messages = {}
  const locales = import.meta.glob('../locales/**/**.json', { eager: true })
  for (const path in locales) {
    const match = path.match(/\.\/locales\/([a-zA-Z0-9-_]+)\/(pages|components)\/(.+)\.json$/)
    if (match) {
      const locale = match[1]
      const section = match[2]
      const relativePath = match[3]

      if (!messages[locale]) {
        messages[locale] = {}
      }
      if (!messages[locale][section]) {
        messages[locale][section] = {}
      }

      const keys = relativePath.split('/')
      let current = messages[locale][section]
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = locales[path].default
    }
  }
  return messages
}

let i18n

function createI18nInstance() {
  const messages = loadLocaleMessages()
  console.log('Loaded messages:', messages)
  i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
  })

  return i18n
}

export { createI18nInstance, i18n }
