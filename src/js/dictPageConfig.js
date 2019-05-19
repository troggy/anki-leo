const dictPageRE = new RegExp('https?://lingualeo.com/(.+?)/dictionary/vocabulary/(.+)$')

export default (url) => {
  const match = url.match(dictPageRE)
  if (!match) return
  let wordGroupId = match[2]
  if (wordGroupId === 'my') {
    wordGroupId = 1
  } else if (wordGroupId === 'jungle') {
    wordGroupId = 2
  } else if (wordGroupId === 'internet') {
    wordGroupId = 3
  } else {
    wordGroupId = parseInt(wordGroupId)
  }
  return { localeName: match[1], wordGroup: wordGroupId }
}
