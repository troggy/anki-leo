require = require('esm')(module) // eslint-disable-line
const describe = require('zora').test
const util = require('./util.js')

describe('Util', t => {
  t.test('format', t => {
    const { format } = util
    t.equal(format('Test'), 'Test')
    t.equal(format('Test {one}', { one: 1 }), 'Test 1')
    t.equal(format('Test {One}', { one: 1 }), 'Test 1')
    t.equal(format('Test {one} and {two}', { one: 1, two: 2 }), 'Test 1 and 2')
    t.equal(format('Test {one} and {two}', { one: 1 }), 'Test 1 and {two}')
  })
})
