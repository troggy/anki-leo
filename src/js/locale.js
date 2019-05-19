import { format } from './util.js'

export default class Locale {
  constructor (lang = 'en', translations) {
    this.lang = lang
    if (!translations[lang]) {
      this.lang = 'en'
    }
    this.translations = translations
  }

  t (key, params) {
    const str = this.translations[this.lang].translation[key]
    return format(str, params)
  }
}
