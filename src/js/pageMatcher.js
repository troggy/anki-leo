export default class PageMatcher {
  constructor() {
    this.targetUrls = [
      '/.+?/userdict$',
      '/.+?/userdict/wordSets/(.+)$',
      '/.+?/glossary/learn/(.+)$',
      '/.+?/glossary/learned/(.+)$',
      '/.+?/glossary/wordSets/(.+)$'
      ];
    this.targetUrlsRE = new Array();
    for (let i = 0; i < this.targetUrls.length; i++) {
      this.targetUrlsRE.push(new RegExp(this.targetUrls[i]));
    }  
  }

  getWordGroupId(url) {
    for (let i = 0; i < this.targetUrlsRE.length; i++) {
      var match = url.match(this.targetUrlsRE[i]);
      if (match) {
        return match.length === 2 ? match[1] : '';
      }
    }
    return false;  
  }
}