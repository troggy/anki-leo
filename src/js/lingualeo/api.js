/* globals fetch */

import GetWordsRequest from './requests/GetWords'
import GetWordSetsRequest from './requests/GetWordSets'

const emptyFilter = () => true

export default class LeoApi {
  constructor (cookie) {
    this.cookie = cookie
  }

  _request (api, requestData, method = 'POST') {
    return fetch(`https://api.lingualeo.com/${api}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          Cookie: this.cookie
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          apiVersion: '1.0.1',
          ...requestData
        })
      })
      .then(response => response.text())
      .then(rsp => JSON.parse(rsp).data)
  }

  getWordSets () {
    return this._request('GetWordSets', GetWordSetsRequest)
  }

  getWordCount (groupId) {
    return this.getWordSets().then(wordSets => {
      const sets = wordSets.reduce((r, { items }) => r.concat(r, items), [])
      const wordSet = sets.filter(g => g.id === groupId)[0]
      return wordSet.cw || wordSet.countWords
    })
  }

  _requestWords (wordSetId, leoFilter, totalWords, filter, progressHandler, page, result) {
    return this._request('GetWords', {
      ...GetWordsRequest,
      ...leoFilter,
      wordSetIds: [wordSetId],
      dateGroup: page.dataGroup,
      offset: page.wordId ? { wordId: page.wordId } : undefined
    }).then((data) => {
      if (data.length === 0) return result
      const groupsWithWords = data.filter(g => g.words.length > 0)
      console.log({ groupsWithWords })

      const currentGroup = groupsWithWords.length
        ? groupsWithWords[groupsWithWords.length - 1].groupName
        : page.dataGroup

      console.log({ currentGroup })

      const words = data.map(g => g.words).flat().filter(filter || emptyFilter)

      result = result.concat(words)
      progressHandler && progressHandler(result.length)

      const currentGroupIndex = data.findIndex(e => e.groupName === currentGroup)

      if (
        (currentGroupIndex === data.length - 1 && !words.length) ||
        result.length >= totalWords
      ) {
        return result
      }

      const nextGroupIndex = currentGroupIndex === data.length - 1 || words.length
        ? currentGroupIndex
        : currentGroupIndex + 1

      console.log({ nextGroupIndex })

      page = {
        dataGroup: data[nextGroupIndex].groupName,
        wordId: words.length ? words[words.length - 1].id : undefined
      }
      return this._requestWords(wordSetId, leoFilter, totalWords, filter, progressHandler, page, result)
    })
  }

  getWords (wordSetId, leoFilter, totalWords, filter, progressHandler) {
    const page = {
      dataGroup: 'start'
    }
    return this._requestWords(wordSetId, leoFilter, totalWords, filter, progressHandler, page, [])
  }
}
