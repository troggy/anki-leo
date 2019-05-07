export default class PageMatcher {
  constructor () {
    this.targetUrls = [
      '/(.+?)/dictionary/vocabulary/(.+)$'
    ]
    this.targetUrlsRE = []
    for (let i = 0; i < this.targetUrls.length; i++) {
      this.targetUrlsRE.push(new RegExp(this.targetUrls[i]))
    }
  }

  getSetup (url) {
    for (let i = 0; i < this.targetUrlsRE.length; i++) {
      var match = url.match(this.targetUrlsRE[i])
      if (match) {
        return { localeName: match[1], wordGroup: match[2] }
      }
    }
    return { localeName: 'en', wordGroup: 1 }
  }
}
