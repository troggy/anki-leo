const dictPageRE = new RegExp('https?://lingualeo.com/(.+?)/dictionary/vocabulary/(.+)$')

export default (url) => {
  const match = url.match(dictPageRE)
  if (!match) return
  return { localeName: match[1], wordGroup: parseInt(match[2]) || 1 }
}