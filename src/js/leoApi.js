
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
          request: requestData,
          token: this.token,
        })
      })
      .then(response => response.text())
      .then(rsp => {
        return JSON.parse(rsp).data[0].items
      })
  }

  getWordSets() {
    return this._request('GetWordSets', [ { type: 'user', 'perPage': 500 } ])
  }

  getWordCount(wordSetName) {
    return this.getWordSets().then(wordSets => {
      console.log(wordSets)
      const groupId = wordSetName === 'my' ? 1 : wordSetName
      return wordSets.filter(g => g.id === groupId)[0].countWords  
    })
  }
}