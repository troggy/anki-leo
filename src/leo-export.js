(function() {

	var isWorking,
			wordSetsMap = [],
			i18next;

	var i18 = function(lang) {
		this.lang = lang || 'en';

		return {
			t: function(key, params) {
				var str = LeoExport.translations[lang].translation[key];
				if (params) {
					var keys = Object.keys(params);
					for (var i = 0; i < keys.length; i++) {
						str = str.replace(new RegExp('\{' + keys[i] + '\}'), params[keys[i]]);
					}
				}
				return str;
			}
		};
	};

	var html = function() {
		return '<div class="filter-level leo-export-extension">' +
			'<a class="btn leo-export-extension-btn" id="leo-export-extension-btn">' + i18next.t('Export') + '</a>' +
			'<ul class="leo-export-extension-menu-container" style="display:none">' +
				'<li class="active"><a href="javascript: void 0" id="leo-export-extension-btn-all"><i class="iconm-none"></i> ' + i18next.t('All') + ' </a></li>' +
				'<li class="active"><a href="javascript: void 0" id="leo-export-extension-btn-new"><i class="iconm-w-big-25"></i> ' + i18next.t('New & Learning') + ' </a></li>' +
				'<li class="active"><a href="javascript: void 0" id="leo-export-extension-btn-selected"><i class="iconm-checklight"></i> ' + i18next.t('Selected') + ' </a></li>' +
			'</ul>' +
		'</div>';
	};

	var mapWordSets = function(wordSets) {
		return wordSets.reduce(function(wordSetsMap, wordSet, i) {
					wordSetsMap[wordSet.id] = wordSet.name.replace(/\s/ig, '_');
					return wordSetsMap;
	 			}, {});
	};

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

	var wordRegExp = function(word) {
		return new RegExp("\\b" + escapeRegExp(word) + "\\b", "ig");
	};

	highlightWord = function(word, string) {
		return string.replace(wordRegExp(word), '<b>$&</b>');
	};

	sanitizeString = function(string) {
		if (!string) return '';
		return string.replace(/;/g, '.').replace(/\r*\n/g, '<br>').replace(/"/g, '""');
	};

	var encloseInDoubleQuotes = function(string) {
		if (string === '' || string == null) return '';
		return '"' + string + '"';
	};

	var wordPicture = function(word) {
		if (!word.user_translates) return '';
		var translation = word.user_translates.find(function(translation) { return !!translation.picture_url; })
		return translation ? 'http:' + translation.picture_url : ''
	};

	var clozefy = function(word, string) {
		return string.replace(wordRegExp(word), '{{c1::$&}}');
	};

	wordToCSV = function(word) {
		var translations = word.user_translates.map(function(t) { return sanitizeString(t.translate_value); }).join(", ");
		var wordValue = sanitizeString(word.word_value);
		var context = sanitizeString(word.context);
		var highlightedContext = highlightWord(wordValue, context);
		var clozefiedContext = clozefy(wordValue, context);
		var picture = '<img src=\'' + wordPicture(word) + '\'>';
		var sound = '[sound:' + word.sound_url + ']';
		var groups = word.groups ? word.groups.map(function(group) { return wordSetsMap[group]; }).join(" ") : '';

		return [
			wordValue,
			translations,
			picture,
			word.transcription,
			highlightedContext,
			sound,
			groups,
			clozefiedContext
		].map(encloseInDoubleQuotes).join(";");
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
			 		showToolTip(i18next.t('Exporting words', { done: wordList.length, total: expectedNumberOfWords }));

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
					showToolTip(i18next.t('Nothing to export'), "success");
				} else {
					var csv = words.map(wordToCSV).join('\n');
					chrome.runtime.sendMessage({
						type: 'LeoExportExtension.DownloadCSV',
						payload: [csv]
					});
					showToolTip(i18next.t('Export complete', { total: words.length }), "success");
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
		$(html()).appendTo("div.dict-title-inner");

		var menu = $(".leo-export-extension-menu-container");
		menu.find("a").click(function() { $("body").click(); });
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
				wordSetsMap = mapWordSets(event.data.payload.wordSets || wordSets);
				i18next = i18(event.data.payload.language);
				createExportButton(event.data.payload.wordsCount, event.data.payload.groupId);
		  }
		}, false);
	};

	init();
}());
