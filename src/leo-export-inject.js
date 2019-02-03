var pageMatcher = LeoExport.PageWithWordsMatcher;

var dictionaryName = document.getElementsByClassName("dict-title-main")[0]
  .textContent;

var getWordCount = () => {
  var wordSets = CONFIG.pages.glossary.wordSets;
  if (typeof wordSets !== "undefined") {
    return wordSets.filter(g => g.name === dictionaryName)[0].countWords;
  } else {
    return CONFIG.pages.userdict3.count_words;
  }
};

var initExportButton = function() {
  var groupId = pageMatcher.getWordGroupId(window.location.pathname);
  // don't add export button, if there is no groupId in URL
  if (groupId === false) return;

  if (document.querySelectorAll("div.dict-title-inner").length > 0) {
    window.postMessage(
      {
        type: "LeoDict",
        payload: {
          wordsCount: getWordCount(),
          language: CONFIG_GLOBAL.i18n.iface,
          groupId: groupId,
          wordSets: CONFIG.pages.glossary.wordSets
        }
      },
      "*"
    );
  }
};

// add handlers for history API
for (let i = 0; i < pageMatcher.targetUrls.length; i++) {
  LEO.HistoryListener.addListener({
    regEx: new RegExp(pageMatcher.targetUrls[i]),
    listener: initExportButton,
    name: "AnkiLeo" + i,
    format: pageMatcher.targetUrls[i]
  });
}

di.require(["$tooltip"], function(tooltip) {
  initExportButton();

  window.addEventListener(
    "message",
    function(event) {
      // We only accept messages from ourselves
      if (event.source !== window) return;

      if (
        event.data.type &&
        event.data.type === "LeoExportExtension.ShowTooltip"
      ) {
        tooltip.show(document.getElementById("leo-export-extension-btn"), {
          content: event.data.payload.message,
          position: "bottom",
          styleClass: event.data.payload.style
        });
      }

      if (
        event.data.type &&
        event.data.type === "LeoExportExtension.AddDropdownHideHandler"
      ) {
        LEO.ui.BodyClickHider.removeItem(
          ".leo-export-extension-menu-container"
        ).addItem(".leo-export-extension-menu-container", function() {
          document.querySelector(
            ".leo-export-extension-menu-container"
          ).style.display = "none";
        });
      }
    },
    false
  );
});
