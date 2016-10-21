(function() {

	var isWorking;

	var html =
	'<div class="filter-level leo-export-extension">' +
		'<a class="btn leo-export-extension-btn" id="leo-export-extension-btn">Скачать</a>' +
		'<ul class="leo-export-extension-menu-container" style="display:none">' +
			'<li class="active"><a href="javascript: void 0" id="leo-export-extension-btn-all"><i class="iconm-none"></i> Все </a></li>' +
			'<li class="active"><a href="javascript: void 0" id="leo-export-extension-btn-new"><i class="iconm-w-big-25"></i> Неизученные </a></li>' +
			'<li class="active"><a href="javascript: void 0" id="leo-export-extension-btn-selected"><i class="iconm-checklight"></i> Выбранные </a></li>' +
		'</ul>' +
	'</div>';

	showToolTip = function(message, style) {
		window.postMessage({
			type: 'LeoExportExtension.ShowTooltip',
			 payload: {
			 	message: message,
			 	style: style
			 }
		  }, '*');
	};

	bindCollapseHandler = function() {
		window.postMessage({ type: 'LeoExportExtension.AddDropdownHideHandler' }, '*');
	};

	escapeRegExp = function(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	};

	highlightWord = function(word, string) {
		var re = new RegExp("\\b" + escapeRegExp(word) + "\\b", "ig");
		return string.replace(re, '<b>$&</b>');
	};

	sanitizeString = function(string) {
		if (!string) return '';
		return string.replace(/;/g, '.').replace(/\r*\n/g, '<br>').replace(/"/g, "'");
	};

	wordToCSV = function(word) {
		var translations = word.user_translates.map(function(t) { return sanitizeString(t.translate_value); }).join(", ");
		var wordValue = sanitizeString(word.word_value);
		var context = highlightWord(wordValue, sanitizeString(word.context));
		var picture = word.user_translates && word.user_translates[0] ? 'http:' + word.user_translates[0].picture_url : '';
		var sound = word.sound_url;

		return [wordValue, translations, picture, word.transcription, context, sound].map(function(item){return '"' + item + '"'}).join(";");
	};

	flattenCategories = function(userdict) {
		return userdict.reduce(function(wordsList, category, i) {
					return wordsList.concat(category.words);
	 			}, []);
	};

	getAllWords = function(filter, groupId, expectedNumberOfWords) {
		var wordType = $(".word-type-btn.selected").data("word-type");
		var leoFilter = $(".dict-filter button.selected").data("filter");
		var url = '/userdict/json?groupId=' + groupId + '&filter=' + leoFilter + '&wordType=' + wordType + '&page=',
			allWordsRecieved = [],
			allWordsRequested = $.Deferred();
			wordList = [];

		var getWordsPage = function(page) {
			var received = $.Deferred();
			allWordsRecieved.push(received.promise());

			$.ajax(url + page, { dataType: 'json' })
				.success(function(data) {
					wordList = wordList.concat(flattenCategories(data.userdict3).filter(filter));
			 		showToolTip("Загружаю слова.<br/>Готово: " + wordList.length + " из " + expectedNumberOfWords);

					if (data.show_more && wordList.length < expectedNumberOfWords) {
						getWordsPage(++page);
					} else {
						allWordsRequested.resolve();
					}
				}).always(function() {
					received.resolve();
				});
		};
		getWordsPage(1);

		var done = $.Deferred();
		allWordsRequested.promise().then(function() {
			$.when.apply($, allWordsRecieved)
				.then(function() {
					done.resolve(wordList);
				});
		});
		return done.promise();
	};

	download = function(filter, groupId, expectedNumberOfWords) {
		if (isWorking) return;
		isWorking = true;


		getAllWords(filter, groupId, expectedNumberOfWords)
			.then(function(words) {
				if (words.length === 0) {
					showToolTip('Нет слов для экпорта.', "success");
				} else {
					var csv = words.map(wordToCSV).join('\n');
			 		saveAs(
			 			new Blob([csv], { type: "text/plain;charset=utf-8" }),
			 			'lingualeo-dict-export.csv'
			 		);

			 		showToolTip('Экспортировано ' + words.length + ' слов', "success");
				}
			})
			.always(function() {
				isWorking = false;
			});
	};

	selectedWordsIds = function() {
		return $("div.dict-item-word.checked").map(function(i, e) { return $(e).data("word-id"); }).get();
	};

	progressFilter = {
		all: function() {
			return function(word) {
				return true;
			};
		},
		no_translate: function() {
			return function(word) {
				return word.progress_percent === 0;
			};
		},
		learning: function() {
			return function(word) {
				return word.progress_percent < 100;
			};
		},
		learned: function() {
			return function(word) {
				return word.progress_percent === 100;
			};
		}
	};

	selectedFilter = function(selectedWords) {
		return function(word) {
			return selectedWords.indexOf(word.word_id) > -1;
		};
	};

	createExportButton = function(totalWordsCount, groupId) {
		if ($(".leo-export-extension").length > 0) $(".leo-export-extension").remove();
		$(html).appendTo("div.dict-title-inner");

		var menu = $(".leo-export-extension-menu-container");
		menu.find("a").click(function() { $("body").click(); });
		console.log("Bound events for: " + groupId);
		$("#leo-export-extension-btn-all").click(function() {
			download(progressFilter.all(), groupId, totalWordsCount);
		});
		$("#leo-export-extension-btn-new").click(function() {
			download(progressFilter.learning(), groupId, totalWordsCount);
		});
		$("#leo-export-extension-btn-selected").click(function() {
			selectedWords = selectedWordsIds();
			if (selectedWords.length === 0) return;

			var allSelected = $(".checkbox-word-con").is(".checked");
			var filterName = $(".dict-filter button.selected").data("filter");
			var selectedWordsCount = $(".dict-search-count").text();

			var filter = allSelected ? progressFilter[filterName]() : selectedFilter(selectedWords);
			download(filter, groupId, selectedWordsCount);
		});


		$("#leo-export-extension-btn").click(function() {
			if (menu.is(":hidden")) {
				bindCollapseHandler();
				menu.show();
			} else {
				menu.hide();
			}
		});
	};

  injectScript = function(script) {
		var s = document.createElement('script');
		s.src = chrome.extension.getURL(script);
		s.onload = function() {
				this.parentNode.removeChild(this);
		};
		(document.head || document.documentElement).appendChild(s);
	};

	init = function() {
		if (typeof document === 'undefined') return;
		// inject script in page that will send dictionary data using portMessage
		injectScript('PageWithWordsMatcher.js');
		injectScript('leo-export-inject.js');

		// subscribe to message to create dictionary export button once received data
		window.addEventListener("message", function(event) {
		  // We only accept messages from ourselves
		  if (event.source != window)
		    return;

		  if (event.data.type && (event.data.type === "LeoDict")) {
		    createExportButton(event.data.payload.wordsCount, event.data.payload.groupId);
		  }
		}, false);
	};

	init();
}());
