import PageMatcher from './pageMatcher.js';
import Locale from './locale.js';
import translations from '../translations.js';
import buttonHtml from './button.html.js';

const menuSel = ".leo-export-extension-menu-container";
const pageMatcher = new PageMatcher();

const dictionaryName = document.getElementsByClassName("dict-title-main")[0]
  .textContent;

var isWorking,
  wordSetsMap = [],
  locale,
  leoTooltip;
  
const buttonElement = () => {
  const buttonEl = document.createElement("div");
  buttonEl.className = "filter-level leo-export-extension";
  buttonEl.innerHTML = locale.format(
    buttonHtml,
    {
      export: locale.t("Export"),
      all: locale.t("All"),
      learning: locale.t("New & Learning"),
      selected: locale.t("Selected"),
    }
  );
  return buttonEl;
};

const mapWordSets = (wordSets) => {
  return wordSets.reduce((wordSetsMap, wordSet) => {
    wordSetsMap[wordSet.id] = wordSet.name.replace(/\s/gi, "_");
    return wordSetsMap;
  }, {});
};

const showToolTip = (message, style) => {
  leoTooltip.show(document.getElementById("leo-export-extension-btn"), {
    content: message,
    position: "bottom",
    styleClass: style,
  });
};

const hideMenu = () => document.querySelector(menuSel).style.display = "none";

const bindCollapseHandler = () =>
  LEO.ui.BodyClickHider.removeItem(menuSel).addItem(menuSel, hideMenu);

// eslint-disable-next-line no-useless-escape
const escapeRegExp = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

const wordRegExp = word => new RegExp("\\b" + escapeRegExp(word) + "\\b", "ig");

const highlightWord = (word, string) => string.replace(wordRegExp(word), "<b>$&</b>");

const sanitizeString = string => {
  if (!string) return "";
  return string
    .replace(/;/g, ".")
    .replace(/\r*\n/g, "<br>")
    .replace(/"/g, '""');
};

const encloseInDoubleQuotes = string => {
  if (string === "" || string == null) return "";
  return '"' + string + '"';
};

const wordPicture = word => {
  if (!word.user_translates) return "";
  const translation = word.user_translates.find(translation =>!!translation.picture_url);
  return translation ? `http:${translation.picture_url}` : "";
};

const clozefy = (word, string) => string.replace(wordRegExp(word), "{{c1::$&}}");

var wordToCSV = (word) => {
  var translations = word.user_translates
    .map(function(t) {
      return sanitizeString(t.translate_value);
    })
    .join(", ");
  var wordValue = sanitizeString(word.word_value);
  var context = sanitizeString(word.context);
  var highlightedContext = highlightWord(wordValue, context);
  var clozefiedContext = clozefy(wordValue, context);
  var picture = "<img src='" + wordPicture(word) + "'>";
  var sound = "[sound:" + word.sound_url + "]";
  var groups = word.groups
    ? word.groups
        .map(function(group) {
          return wordSetsMap[group];
        })
        .join(" ")
    : "";

  return [
    wordValue,
    translations,
    picture,
    word.transcription,
    highlightedContext,
    sound,
    groups,
    clozefiedContext
  ]
    .map(encloseInDoubleQuotes)
    .join(";");
};

var flattenCategories = (userdict) => {
  return userdict.reduce(
    (wordsList, category) => wordsList.concat(category.words), 
    []
  );
};

var getAllWords = function(filter, groupId, expectedNumberOfWords) {
  var wordType = document.querySelector(".word-type-btn.selected").dataset
    .wordType;
  var leoFilter = document.querySelector(".dict-filter button.selected")
    .dataset.filter;
  var url =
      "/userdict/json?groupId=" +
      groupId +
      "&filter=" +
      leoFilter +
      "&wordType=" +
      wordType +
      "&page=",
    wordList = [];

  var getWordsPage = page => {
    return fetch(url + page)
      .then(resp => resp.json())
      .then(data => {
        var words = flattenCategories(data.userdict3).filter(filter);
        wordList = wordList.concat(words);
        showToolTip(
          locale.t("Exporting words", {
            done: wordList.length,
            total: expectedNumberOfWords
          })
        );
        if (!data.show_more || wordList.length >= expectedNumberOfWords) {
          return words;
        }
        // we have more words to fetch, recurse deeper
        return getWordsPage(++page).then(moreWords =>
          words.concat(moreWords)
        );
      });
  };
  return getWordsPage(1);
};

var download = function(filter, groupId, expectedNumberOfWords) {
  if (isWorking) return;
  isWorking = true;

  getAllWords(filter, groupId, expectedNumberOfWords).then(function(words) {
    if (words.length === 0) {
      showToolTip(locale.t("Nothing to export"), "success");
    } else {
      var csv = words.map(wordToCSV).join("\n");
      window.postMessage({
        type: "ankileo.download",
        payload: {
          data: [csv],
          name: 'ankileo.csv',
        },
      });
      
      showToolTip(
        locale.t("Export complete", { total: words.length }),
        "success"
      );
    }
    isWorking = false;
  });
};

var selectedWordsIds = function() {
  return Array.prototype.map.call(
    document.querySelectorAll("div.dict-item-word.checked"),
    n => Number(n.dataset.wordId)
  );
};

var progressFilter = {
  all: () => () => true,
  no_translate: () => word => word.progress_percent === 0,
  learning: () => word => word.progress_percent < 100,
  learned: () => word => word.progress_percent === 100,
};

var selectedFilter = selectedWords => word => selectedWords.indexOf(word.word_id) > -1;

var createExportButton = function(totalWordsCount, groupId) {
  if (document.querySelector(".leo-export-extension")) {
    document.querySelector(".leo-export-extension").remove();
  }
  document.querySelector("div.dict-title-inner").appendChild(buttonElement());

  var menu = document.querySelector(menuSel);

  var bodyClick = () => document.getElementsByTagName("body")[0].click();

  for (let menuItem of menu.getElementsByTagName("a")) {
    menuItem.addEventListener("click", bodyClick);
  }

  document
    .getElementById("leo-export-extension-btn-all")
    .addEventListener("click", () => {
      download(progressFilter.all(), groupId, totalWordsCount);
    });

  document
    .getElementById("leo-export-extension-btn-new")
    .addEventListener("click", () => {
      download(progressFilter.learning(), groupId, totalWordsCount);
    });

  document
    .getElementById("leo-export-extension-btn-selected")
    .addEventListener("click", () => {
      var selectedWords = selectedWordsIds();
      if (selectedWords.length === 0) return;

      var allSelected = !!document.querySelector(
        "span.checkbox-word-con.checked"
      );
      var filterName = document.querySelector(".dict-filter button.selected")
        .dataset.filter;
      var selectedWordsCount = document.querySelector(".dict-search-count")
        .textContent;

      var filter = allSelected
        ? progressFilter[filterName]()
        : selectedFilter(selectedWords);
      download(filter, groupId, selectedWordsCount);
    });

  document
    .getElementById("leo-export-extension-btn")
    .addEventListener("click", () => {
      if (menu.style.display === "none") {
        bindCollapseHandler();
        menu.style.display = "block";
      } else {
        menu.style.display = "none";
      }
    });
};

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
    wordSetsMap = mapWordSets(CONFIG.pages.glossary.wordSets);
    locale = new Locale(CONFIG_GLOBAL.i18n.iface, translations);
    createExportButton(
      getWordCount(),
      groupId
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
  leoTooltip = tooltip;
});
