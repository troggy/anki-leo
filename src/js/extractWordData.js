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
  const translationWithPic = word.translations.find(tr => tr.pics && tr.pics.length > 0)
  return translationWithPic ? `<img src='http:${translationWithPic.pics[0]}'>` : ''
}

const wordContext = (word) => {
  if (!word.translations[0].ctx) return ''

  const contextRaw = word.translations[0].ctx.startsWith('{')
    ? JSON.parse(word.translations[0].ctx).context_text
    : word.translations[0].ctx

  return sanitizeString(contextRaw)
}

const clozefy = (word, string) => string.replace(wordRegExp(word), '{{c1::$&}}')

const extractWordData = (word) => {
  const translations = word.translations
    .map(t => sanitizeString(t.tr))
    .join(', ')
  const wordValue = sanitizeString(word.wordValue)
  const context = wordContext(word)
  const highlightedContext = highlightWord(wordValue, context)
  const clozefiedContext = clozefy(wordValue, context)
  const image = wordPicture(word)
  const sound = `[sound:${word.pronunciation}]`
  const groups = (word.wordSets || []).map(ws => ws.name).join(',')

  return {
    word: wordValue,
    translations,
    image,
    transcription: word.transcription,
    context: highlightedContext,
    sound,
    groups,
    clozefiedContext
  }
}

export default extractWordData
