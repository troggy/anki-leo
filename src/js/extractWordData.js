// eslint-disable-next-line no-useless-escape
const escapeRegExp = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')

const wordRegExp = word => new RegExp('\\b' + escapeRegExp(word) + '\\b', 'ig')

const highlightWord = (word, string) => string.replace(wordRegExp(word), '<b>$&</b>')

const sanitizeString = string => {
  if (!string) return ''
  return string
    .replace(/;/g, '.')
    .replace(/\r*\n/g, '<br>')
    .replace(/"/g, '""')
}

const wordPicture = translations => {
  if (!translations) return ''
  const translationWithPic = translations.find(tr =>
    tr.pic && !tr.pic.startsWith('https://contentcdn.lingualeo.com/uploads/upimages')
  )
  return translationWithPic ? `<img src='${translationWithPic.pic}'>` : ''
}

const isWrappedContext = (contextStr) => {
  try {
    return !!(JSON.parse(contextStr) || {}).context_text
  } catch (e) {
    return false
  }
}

const wordContext = (translation) => {
  if (!translation || !translation.ctx) return ''

  const rawContext = translation.ctx

  try {
    const contextObj = JSON.parse(rawContext) || {}
    return sanitizeString(contextObj.context_text || rawContext)
  } catch (e) {
    return sanitizeString(rawContext)
  }
}

const clozefy = (word, string) => string.replace(wordRegExp(word), '{{c1::$&}}')

const selectedTranslations = (word) => {
  if (!word.translations) return []
  const fromInternet = word.translations.filter(tr => isWrappedContext(tr.ctx))
  return fromInternet.length > 0 ? fromInternet : [word.translations[0]]
}

const extractWordData = (word) => {
  const userTranslations = selectedTranslations(word)
  const translations = sanitizeString(word.combinedTranslation)
  const wordValue = sanitizeString(word.wordValue)
  const context = wordContext(userTranslations[0])
  const highlightedContext = highlightWord(wordValue, context)
  const clozefiedContext = clozefy(wordValue, context)
  const image = wordPicture(userTranslations) || wordPicture(word.translations)
  const sound = `[sound:${word.pronunciation}]`
  const groups = (word.wordSets || []).map(ws => ws.name).join(',')
  const association = sanitizeString(word.association)

  return {
    word: wordValue,
    translations,
    image,
    transcription: word.transcription,
    context: highlightedContext,
    sound,
    groups,
    association,
    clozefiedContext
  }
}

export default extractWordData
