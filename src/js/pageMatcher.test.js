require = require("esm")(module); // eslint-disable-line no-undef
const describe = require("zora").test;
const PageMatcher = require("./pageMatcher").default;

var matcher = new PageMatcher();

describe('PageMatcher', t => {
  t.test('getWordGroupId', t => {
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
  
    tests.forEach(fxt => {
      t.test('should ' + (fxt.expected === false ? 'NOT ' : '') + 'match ' + fxt.url, t => {
        t.equal(matcher.getWordGroupId(fxt.url), fxt.expected);
      });
    });
  });  
});

