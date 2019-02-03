window = {}; // eslint-disable-line no-global-assign
require('./PageWithWordsMatcher.js');
var matcher = window.LeoExport.PageWithWordsMatcher;

var assert = require('assert');

describe('PageWithWordsMatcher', () => {

  describe('getWordGroupId', () => {
    var tests = [
      { url: '/ru/userdict',                  expected: '' },
      { url: '/ru/userdict/wordSets/6505',    expected: '6505' },
      { url: '/ru/glossary/learn',            expected: false },
      { url: '/ru/glossary/learn/jungle',     expected: 'jungle' },
      { url: '/ru/glossary/learn/somessome',  expected: 'somessome' },
      { url: '/ru/glossary/learned',          expected: false },
      { url: '/ru/glossary/learned/2008',     expected: '2008' },
      { url: '/ru/glossary/wordSets',         expected: false },
      { url: '/ru/glossary/wordSets/6505',    expected: '6505' },
      { url: '/ru/glossary/learn/6506',       expected: '6506' },
    ];

    tests.forEach((test) => {
      it('should ' + (test.expected === false ? 'NOT ' : '') + 'match ' + test.url, () => {
        assert.equal(matcher.getWordGroupId(test.url), test.expected);
      });
    });
  });
})
