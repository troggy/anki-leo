
export default class LeoApi {
  constructor(token) {
    this.token = token
  }

  _request(api, requestData, method = 'POST') {
    return fetch(`https://mobile-api.lingualeo.com/${api}`,
      {
        method,
        headers: {
          'Content-Type': 'text/plain',
        },
        mode: "cors",
        body: JSON.stringify({
          apiVersion: '1.0.0',
          token: this.token,
          ...requestData,
        })
      })
      .then(response => response.text())
      .then(rsp => {
        return JSON.parse(rsp).data
      })
  }

  getWordSets() {
    return this._request('GetWordSets', { request: [ { type: 'user', 'perPage': 500 } ] })
  }

  getWordCount(groupId) {
    return this.getWordSets().then(wordSets => {
      const wordSet = wordSets[0].items.filter(g => g.id === groupId)[0]
      return wordSet.cw || wordSet.countWords  
    })
  }

  _requestWords(wordSetId, leoFilter, totalWords, filter, progressHandler, page, result) {
    return this._request('GetWords', {
      op: "loadWordsForDict",
      ...leoFilter,
      attrList: {
          id: "id",
          wordValue: "wd",
          wordSets: "ws",
          translations: "trs",
          learningStatus: "ls",
          progress: "pi",
          transcription: "scr",
          pronunciation: "pron",
      },
      wordSetIds: [wordSetId],
      perPage: 300,
      page: page
    }).then(data => {
      if (data.length === 0) return result
      result = result.concat(data.filter(filter ? filter : () => true ))
      progressHandler && progressHandler(result.length)
      if (result.length >= totalWords) return result
      return this._requestWords(wordSetId, leoFilter, totalWords, filter, progressHandler, page + 1, result)
    })
  }

  getWords(wordSetId, leoFilter, totalWords, filter, progressHandler) {
    return this._requestWords(wordSetId, leoFilter, totalWords, filter, progressHandler, 1, [])
  }
}