require = require('esm')(module) // eslint-disable-line
const describe = require('zora').test
const dictPageConfig = require('./dictPageConfig').default

describe('dictPageConfig', t => {
  t.test('dictPage', t => {
    var tests = [
      { 
        url: 'https://lingualeo.com/ru/dictionary/vocabulary/my', 
        expected: { localeName: 'ru', wordGroup: 1 }
      },
      { 
        url: 'https://lingualeo.com/ru/dictionary/vocabulary/12', 
        expected: { localeName: 'ru', wordGroup: 12 }
      },
      { 
        url: 'http://lingualeo.com/ru/dictionary/vocabulary/12', 
        expected: { localeName: 'ru', wordGroup: 12 }
      },
      { 
        url: 'https://lingualeo.com/ru/dashboard', 
        expected: undefined
      }
    ]

    tests.forEach(fxt => {
      t.test('should ' + (fxt.expected === false ? 'NOT ' : '') + 'match ' + fxt.url, t => {
        t.deepEqual(dictPageConfig(fxt.url), fxt.expected)
      })
    })
  })
})
