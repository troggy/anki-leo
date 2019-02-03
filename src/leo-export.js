(function() {
  var isWorking,
    wordSetsMap = [],
    i18next;

  var i18 = function(lang) {
    this.lang = lang || "en";

    return {
      t: function(key, params) {
        var str = LeoExport.translations[lang].translation[key];
        if (params) {
          var keys = Object.keys(params);
          for (var i = 0; i < keys.length; i++) {
            // eslint-disable-line no-useless-escape
            str = str.replace(new RegExp("{" + keys[i] + "}"), params[keys[i]]);
          }
        }
        return str;
      }
    };
  };

  var buttonElement = function() {
    var buttonEl = document.createElement("div");
    buttonEl.className = "filter-level leo-export-extension";
    buttonEl.innerHTML =
      '<a class="btn leo-export-extension-btn" id="leo-export-extension-btn">' +
      i18next.t("Export") +
      "</a>" +
      '<ul class="leo-export-extension-menu-container" style="display:none">' +
      '<li class="active"><a href="javascript: void 0" id="leo-export-extension-btn-all"><i class="iconm-none"></i> ' +
      i18next.t("All") +
      " </a></li>" +
      '<li class="active"><a href="javascript: void 0" id="leo-export-extension-btn-new"><i class="iconm-w-big-25"></i> ' +
      i18next.t("New & Learning") +
      " </a></li>" +
      '<li class="active"><a href="javascript: void 0" id="leo-export-extension-btn-selected"><i class="iconm-checklight"></i> ' +
      i18next.t("Selected") +
      " </a></li>" +
      "</ul>";
    return buttonEl;
  };

  var mapWordSets = (wordSets) => {
    return wordSets.reduce((wordSetsMap, wordSet) => {
      wordSetsMap[wordSet.id] = wordSet.name.replace(/\s/gi, "_");
      return wordSetsMap;
    }, {});
  };

  var showToolTip = function(message, style) {
    window.postMessage(
      {
        type: "LeoExportExtension.ShowTooltip",
        payload: {
          message: message,
          style: style
        }
      },
      "*"
    );
  };

  var bindCollapseHandler = function() {
    window.postMessage(
      { type: "LeoExportExtension.AddDropdownHideHandler" },
      "*"
    );
  };

  var escapeRegExp = function(str) {
    // eslint-disable-next-line no-useless-escape
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  var wordRegExp = function(word) {
    return new RegExp("\\b" + escapeRegExp(word) + "\\b", "ig");
  };

  var highlightWord = function(word, string) {
    return string.replace(wordRegExp(word), "<b>$&</b>");
  };

  var sanitizeString = function(string) {
    if (!string) return "";
    return string
      .replace(/;/g, ".")
      .replace(/\r*\n/g, "<br>")
      .replace(/"/g, '""');
  };

  var encloseInDoubleQuotes = function(string) {
    if (string === "" || string == null) return "";
    return '"' + string + '"';
  };

  var wordPicture = function(word) {
    if (!word.user_translates) return "";
    var translation = word.user_translates.find(function(translation) {
      return !!translation.picture_url;
    });
    return translation ? "http:" + translation.picture_url : "";
  };

  var clozefy = function(word, string) {
    return string.replace(wordRegExp(word), "{{c1::$&}}");
  };

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
            i18next.t("Exporting words", {
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
        showToolTip(i18next.t("Nothing to export"), "success");
      } else {
        var csv = words.map(wordToCSV).join("\n");
        chrome.runtime.sendMessage({
          type: "LeoExportExtension.DownloadCSV",
          payload: [csv]
        });
        showToolTip(
          i18next.t("Export complete", { total: words.length }),
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

    var menu = document.querySelector(".leo-export-extension-menu-container");

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

  var injectScript = function(script) {
    var s = document.createElement("script");
    s.src = chrome.extension.getURL(script);
    s.onload = function() {
      this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
  };

  var init = function() {
    if (typeof document === "undefined") return;
    // inject script in page that will send dictionary data using portMessage
    injectScript("PageWithWordsMatcher.js");
    injectScript("leo-export-inject.js");

    // subscribe to message to create dictionary export button once received data
    window.addEventListener(
      "message",
      function(event) {
        // We only accept messages from ourselves
        if (event.source != window) return;

        if (event.data.type && event.data.type === "LeoDict") {
          wordSetsMap = mapWordSets(event.data.payload.wordSets);
          i18next = i18(event.data.payload.language);
          createExportButton(
            event.data.payload.wordsCount,
            event.data.payload.groupId
          );
        }
      },
      false
    );
  };

  init();
})();
