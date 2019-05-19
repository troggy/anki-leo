import { format } from './util.js'

const messages = {
  en: require('./locales/en/messages.json'),
  ru: require('./locales/ru/messages.json'),
  es: require('./locales/es/messages.json')
}

export default class Locale {
  constructor (lang = 'en') {
    this.lang = lang

    if (!messages[lang]) {
      this.lang = 'en'
    }
  }

  t (key, params) {
    const str = (messages[this.lang][key] || {}).message || key
    return format(str, params)
  }
}
