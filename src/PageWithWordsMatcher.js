var PageWithWordsMatcher = function() {
  this.targetUrls = [
    '\/.+?\/userdict$',
    '\/.+?\/userdict\/wordSets\/(\.+)$',
    '\/.+?\/glossary\/learn\/(\.+)$',
    '\/.+?\/glossary\/learned\/(\.+)$',
    '\/.+?\/glossary\/wordSets\/(\.+)$'
    ];
  this.targetUrlsRE = new Array();
  for (var i = 0; i < this.targetUrls.length; i++) {
    this.targetUrlsRE.push(new RegExp(this.targetUrls[i]));
  }
};

PageWithWordsMatcher.prototype.getWordGroupId = function(url) {
  for (var i = 0; i < this.targetUrlsRE.length; i++) {
    var match = url.match(this.targetUrlsRE[i]);
    if (match) {
      return match.length === 2 ? match[1] : '';
    }
  }
  return false;
};

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = new PageWithWordsMatcher();
  }
  exports.PageWithWordsMatcher = new PageWithWordsMatcher();
} else {
  if (typeof window.LeoExport === 'undefined') {
    window.LeoExport = {};
  }
  window.LeoExport.PageWithWordsMatcher = new PageWithWordsMatcher();
}
