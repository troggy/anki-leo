require = require('esm')(module) // eslint-disable-line
const describe = require('zora').test
const dictPageConfig = require('./dictPageConfig').default

describe('dictPageConfig', t => {
  t.test('dictPage', t => {
    var tests = [
      { 
        url: 'https://lingualeo.com/ru/dictionary/vocabulary/my', 
        expected: { localeName: 'ru', wordGroup: 1 }
      }
    ]

    tests.forEach(fxt => {
      t.test('should ' + (fxt.expected === false ? 'NOT ' : '') + 'match ' + fxt.url, t => {
        t.equal(dictPageConfig(fxt.url), fxt.expected)
      })
    })
  })
})
