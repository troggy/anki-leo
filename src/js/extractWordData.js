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

const wordPicture = word => {
  if (!word) return ''
  return word.picture && word.picture.startsWith('https://contentcdn.lingualeo.com/uploads/picture') ? `<img src='${word.picture}'>` : ''
}

const wordContext = (word) => {
  if (!word || !word.context) return ''

  const rawContext = word.context

  try {
    const contextObj = JSON.parse(rawContext) || {}
    return sanitizeString(contextObj.context_text || rawContext)
  } catch (e) {
    return sanitizeString(rawContext)
  }
}

const clozefy = (word, string) => string.replace(wordRegExp(word), '{{c1::$&}}')

const extractWordData = (word) => {
  const translations = sanitizeString(word.combinedTranslation)
  const wordValue = sanitizeString(word.wordValue)
  const context = wordContext(word)
  const highlightedContext = highlightWord(wordValue, context)
  const clozefiedContext = clozefy(wordValue, context)
  const image = wordPicture(word)
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
