
var allWordsRecieved = [],
	wordsCount,
	wordsCSVList = [],
	isWorking;

var showToolTip = function(message, style) {
	window.postMessage({ 
		type: 'LeoExportExtension.Message',
		 payload: { 
		 	message: message,
		 	style: style
		 }
	  }, '*');
};

var wordsToCSV = function(words) {
	return words.reduce(function(wordsList, category, i) { 
				return wordsList.concat(category.words.map(function(word) {
	 					 return word.word_value + ';' + word.user_translates[0].translate_value.replace(/;/g, '.')
	 					  + ';http:' + word.user_translates[0].picture_url + ';' + word.transcription + ';' + (word.context ? word.context.replace(/;/g, '.').replace(/\n/, '') : '');
		 		 		}));
 			}, new Array());
}

var requestAllWords = function(url) {
	var allWordsRequested = $.Deferred();

	var getWordsPage = function(url, page) {
		var dfd = $.Deferred();
		allWordsRecieved.push(dfd.promise());

		$.ajax(url + page, { dataType: 'json' })
			.success(function(data) {
				wordsCSVList = wordsCSVList.concat(wordsToCSV(data.userdict3));
		 		showToolTip("Загружаю слова.<br/>Готово: " + wordsCSVList.length + " из " + wordsCount)

				if (data.show_more) {
					getWordsPage(url, ++page);
				} else {
					allWordsRequested.resolve();
				}			
			}).always(function() {
				dfd.resolve();
			});
	};
	getWordsPage(url, 1);

	return allWordsRequested.promise();
};

var createExportButton = function(data) {
	wordsCount = data.wordsCount;

	$("<a class='btn' id='leo-export-extension-button'>Экспорт</a>").appendTo("div.dict-title-inner").click(function() {
		if (isWorking) return;
		isWorking = true;
		var url = '/userdict/json?_hash=' + data.serverHash + '&page=';

		wordsCSVList = [],
		allWordsRecieved = [];

		$.when(requestAllWords(url))
			.then(function() {

				$.when.apply($, allWordsRecieved).then(function() {

			 		saveAs(
			 			new Blob([wordsCSVList.join('\n')], {type: "text/plain;charset=utf-8"}),
			 			'lingualeo-dict-export.csv'
			 		);

			 		showToolTip('Экспортировано ' + wordsCSVList.length + ' слов', "success")
				}).always(function() {
					isWorking = false;
				});
			});
	});
};


// inject script in page that will send dictionary data using portMessage
var s = document.createElement('script');
s.src = chrome.extension.getURL('leo-export-inject.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);


// subscribe to message to create dictionary export button once received data
window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "LeoDict")) {
    createExportButton(event.data.payload);
  }
}, false);

