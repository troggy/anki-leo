import fetchWordsFromLeo from './fetchWordsFromLeo.js';
import translations from '../translations.js';
import PageMatcher from './pageMatcher.js';
import buttonHtml from './button.html.js';
import { format } from './util.js';
import Locale from './locale.js';
import toCsv from './toCsv.js';

const menuSel = ".leo-export-extension-menu-container";
const pageMatcher = new PageMatcher();

let isWorking,
  wordSetsMap = [],
  locale,
  leoTooltip;
  
const buttonElement = () => {
  const buttonEl = document.createElement("div");
  buttonEl.className = "filter-level leo-export-extension";
  buttonEl.innerHTML = format(
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
  return wordSets.reduce((map, wordSet) => {
    map[wordSet.id] = wordSet.name.replace(/\s/gi, "_");
    return map;
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

const download = (filter, groupId, expectedNumberOfWords) => {
  if (isWorking) return;
  isWorking = true;

  const wordType = document.querySelector(".word-type-btn.selected").dataset
    .wordType;
  const leoFilter = document.querySelector(".dict-filter button.selected")
    .dataset.filter;

  const progressReporter = (exported) =>
    showToolTip(
      locale.t("Exporting words", {
        done: exported,
        total: expectedNumberOfWords
      })
    );

  fetchWordsFromLeo(filter, groupId, expectedNumberOfWords, wordType, leoFilter, progressReporter)
    .then(function(words) {
      if (words.length === 0) {
        showToolTip(locale.t("Nothing to export"), "success");
      } else {
        const outfile = toCsv(words, wordSetsMap);
        window.postMessage({
          type: "ankileo.download",
          payload: {
            data: [outfile],
            name: 'lingualeo.csv',
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

const selectedWordsIds = () => {
  return Array.prototype.map.call(
    document.querySelectorAll("div.dict-item-word.checked"),
    n => Number(n.dataset.wordId)
  );
};

const progressFilter = {
  all: () => true,
  no_translate: word => word.progress_percent === 0,
  learning: word => word.progress_percent < 100,
  learned: word => word.progress_percent === 100,
};

const selectedFilter = selectedWords => word => selectedWords.indexOf(word.word_id) > -1;

const createExportButton = function(totalWordsCount, groupId) {
  if (document.querySelector(".leo-export-extension")) {
    document.querySelector(".leo-export-extension").remove();
  }
  document.querySelector("div.dict-title-inner").appendChild(buttonElement());

  const menu = document.querySelector(menuSel);

  const bodyClick = () => document.getElementsByTagName("body")[0].click();

  for (let menuItem of menu.getElementsByTagName("a")) {
    menuItem.addEventListener("click", bodyClick);
  }

  document
    .getElementById("leo-export-extension-btn-all")
    .addEventListener("click", () => {
      download(progressFilter.all, groupId, totalWordsCount);
    });

  document
    .getElementById("leo-export-extension-btn-new")
    .addEventListener("click", () => {
      download(progressFilter.learning, groupId, totalWordsCount);
    });

  document
    .getElementById("leo-export-extension-btn-selected")
    .addEventListener("click", () => {
      const selectedWords = selectedWordsIds();
      if (selectedWords.length === 0) return;

      const allSelected = !!document.querySelector(
        "span.checkbox-word-con.checked"
      );
      const filterName = document.querySelector(".dict-filter button.selected")
        .dataset.filter;
      const selectedWordsCount = document.querySelector(".dict-search-count")
        .textContent;

      const filter = allSelected
        ? progressFilter[filterName]
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

const getWordCount = () => {
  const dictionaryName = document.getElementsByClassName("dict-title-main")[0]
  .textContent;
  const wordSets = CONFIG.pages.glossary.wordSets;
  if (typeof wordSets !== "undefined") {
    return wordSets.filter(g => g.name === dictionaryName)[0].countWords;
  } else {
    return CONFIG.pages.userdict3.count_words;
  }
};

const initExportButton = () => {
  const groupId = pageMatcher.getWordGroupId(window.location.pathname);
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
