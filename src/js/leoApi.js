/* globals fetch */

const emptyFilter = () => true

export default class LeoApi {
  constructor (token) {
    this.token = token
  }

  _request (api, requestData, method = 'POST') {
    return fetch(`https://api.lingualeo.com/${api}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          apiVersion: '1.0.1',
          ...requestData
        })
      })
      .then(response => response.text())
      .then(rsp => {
        return JSON.parse(rsp).data
      })
  }

  getWordSets () {
    return this._request('GetWordSets', {
      "op": "loadSets: \n[\n  {\n    \"req\": \"recomm\",\n    \"opts\": {\n      \"category\": \"all\",\n      \"page\": 1,\n      \"perPage\": 20\n    },\n    \"attrs\": [\n      \"type\",\n      \"id\",\n      \"name\",\n      \"countWords\",\n      \"countWordsLearned\",\n      \"picture\",\n      \"category\",\n      \"status\",\n      \"source\",\n      \"level\"\n    ]\n  },\n  {\n    \"req\": \"myOnLearning\",\n    \"opts\": {\n      \"category\": \"word\",\n      \"page\": 1,\n      \"perPage\": 20\n    },\n    \"attrs\": [\n      \"type\",\n      \"id\",\n      \"name\",\n      \"countWords\",\n      \"countWordsLearned\",\n      \"picture\",\n      \"category\",\n      \"status\",\n      \"source\",\n      \"level\"\n    ]\n  }\n]",
      "request": [
        {
          "subOp": "recomm",
          "type": "global",
          "contentType": "recommended",
          "category": "all",
          "page": 1,
          "perPage": 20,
          "sortBy": "created",
          "attrList": {
            "type": "type",
            "id": "id",
            "name": "name",
            "countWords": "cw",
            "wordSetId": "wordSetId",
            "picture": "pic",
            "category": "cat",
            "level": "level"
          }
        },
        {
          "subOp": "myOnLearning",
          "type": "user",
          "status": "learning",
          "sortBy": "created",
          "category": "word",
          "page": 1,
          "perPage": 999,
          "attrList": {
            "type": "type",
            "id": "id",
            "category": "cat",
            "name": "name",
            "countWords": "cw",
            "wordSetId": "wordSetId",
            "picture": "pic",
            "status": "st",
            "source": "src"
          }
        }
      ],
      "ctx": {
        "config": {
          "isCheckData": true,
          "isLogging": true
        }
      }
    })
  }

  getWordCount (groupId) {
    return this.getWordSets().then(wordSets => {
      const sets = wordSets.reduce((r, { items }) => r.concat(r, items), [])
      const wordSet = sets.filter(g => g.id === groupId)[0]
      return wordSet.cw || wordSet.countWords
    })
  }

  _requestWords (wordSetId, leoFilter, totalWords, filter, progressHandler, page, result) {
    const requestWords = (wordIds) => {
      return this._request('GetWords', {
        ...leoFilter,
        attrList: {
          id: 'id',
          wordValue: 'wd',
          origin: 'wo',
          wordType: 'wt',
          translations: 'trs',
          wordSets: 'ws',
          created: 'cd',
          learningStatus: 'ls',
          progress: 'pi',
          transcription: 'scr',
          pronunciation: 'pron',
          relatedWords: 'rw',
          association: 'as',
          trainings: 'trainings',
          listWordSets: 'listWordSets',
          combinedTranslation: 'trc',
          picture: 'pic',
          speechPartId: 'pid',
          wordLemmaId: 'lid',
          wordLemmaValue: 'lwd'
        },
        mode: wordIds ? '4' : 'basic',
        training: null,
        wordSetId: wordSetId,
        perPage: 300,
        dateGroup: page.dataGroup,
        offset: page.wordId ? { wordId: page.wordId } : undefined,
        wordIds
      })
    }

    return requestWords()
      .then((data) => {
        if (data.length === 0) return result
        // extracting word Ids so we can repeat a call to get words' context
        const wordIds = [].concat.apply(
          [],
          data.reduce((arr, i) => {
            arr.push(i.words)
            return arr
          }, []).filter(i => i)).map(w => w.id)
        return Promise.all([requestWords(wordIds.length > 0 ? wordIds : null), data])
      })
      .then(([data, basicRequest]) => {
        if (basicRequest.length === 0) return result
        const groupsWithWords = basicRequest.filter(g => g.words && g.words.length > 0)

        const currentGroup = groupsWithWords.length
          ? groupsWithWords[groupsWithWords.length - 1].groupName
          : page.dataGroup

        const words = data.filter(g => g.words)
          .map(g => g.words).flat().filter(filter || emptyFilter)

        result = result.concat(words)
        progressHandler && progressHandler(result.length)

        const currentGroupIndex = basicRequest.findIndex(e => e.groupName === currentGroup)

        if (
          (currentGroupIndex === basicRequest.length - 1 && !words.length) ||
        result.length >= totalWords
        ) {
          return result
        }

        const nextGroupIndex = currentGroupIndex === basicRequest.length - 1 || words.length
          ? currentGroupIndex
          : currentGroupIndex + 1

        page = {
          dataGroup: basicRequest[nextGroupIndex].groupName,
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
