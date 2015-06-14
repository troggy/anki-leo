var matcher = require('../src/PageWithWordsMatcher.js');
var assert = require("chai").assert;

describe('PageWithWordsMatcher', function(){

  describe('getWordGroupId', function() {
    var tests = [
      { url: '/ru/userdict',                  expected: '' },
      { url: '/ru/glossary/learn',            expected: false },
      { url: '/ru/glossary/learn/jungle',     expected: 'jungle' },
      { url: '/ru/glossary/learn/somessome',  expected: 'somessome' },
      { url: '/ru/glossary/learned',          expected: false },
      { url: '/ru/glossary/learned/2008',     expected: '2008' },
      { url: '/ru/glossary/wordSets',         expected: false },
      { url: '/ru/glossary/wordSets/6505',    expected: '6505' },
      { url: '/ru/glossary/learn/6506',       expected: '6506' },
    ];

    tests.forEach(function(test) {
      it('should ' + (!test.expected ? 'NOT ' : '') + 'match ' + test.url, function() {
        var res = matcher.getWordGroupId(test.url);
        assert.equal(res, test.expected);
      });
    });
  });
})
