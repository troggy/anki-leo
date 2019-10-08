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
          apiVersion: '1.0.0',
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

  _requestWords (wordSetId, leoFilter, totalWords, filter, progressHandler, offsetWordId, result) {
    return this._request('GetWords', {
      ...GetWordsRequest,
      ...leoFilter,
      wordSetIds: [wordSetId],
      offset: offsetWordId ? { wordId: offsetWordId } : undefined
    }).then((data) => {
      if (data.length === 0) return result

      const words = data.filter(filter || emptyFilter)

      result = result.concat(words)
      progressHandler && progressHandler(result.length)
      if (result.length >= totalWords) return result

      const offsetWordId = data[data.length - 1].id
      return this._requestWords(wordSetId, leoFilter, totalWords, filter, progressHandler, offsetWordId, result)
    })
  }

  getWords (wordSetId, leoFilter, totalWords, filter, progressHandler) {
    return this._requestWords(wordSetId, leoFilter, totalWords, filter, progressHandler, null, [])
  }
}
