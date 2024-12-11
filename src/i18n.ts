import { createI18n } from 'vue-i18n'
import en from './locales/en-US.json'
import ru from './locales/ru-RU.json'

function loadLocaleMessages() {
  const locales = [{ en: en }, { ru: ru }]
  const messages = {}
  locales.forEach((lang) => {
    const key = Object.keys(lang)
    messages[key] = lang[key]
  })
  return messages
}

export default createI18n({
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'ru',
  legacy: false,
  messages: loadLocaleMessages(),
})
