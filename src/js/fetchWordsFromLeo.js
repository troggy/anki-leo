/* global fetch */
const flattenCategories = userdict =>
  userdict.reduce((list, cat) => list.concat(cat.words), [])

const fetchWordsFromLeo = (
  filter, groupId, expectedNumberOfWords, wordType, leoFilter, progress
) => {
  const url = `/userdict/json?groupId=${groupId}&filter=${leoFilter}&wordType=${wordType}&page=`
  let downloaded = 0

  const fetchWordsPage = page => {
    return fetch(url + page)
      .then(resp => resp.json())
      .then(data => {
        const words = flattenCategories(data.userdict3).filter(filter)
        downloaded += words.length
        progress(downloaded)

        // nothing to download or downloaded enough — stop recursing
        if (!data.show_more || downloaded >= expectedNumberOfWords) {
          return words
        }
        // otherwise we have more words to fetch — recurse deeper
        return fetchWordsPage(++page).then(moreWords =>
          words.concat(moreWords)
        )
      })
  }
  return fetchWordsPage(1)
}

export default fetchWordsFromLeo
