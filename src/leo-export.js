var createExportButton = function(dict) {
	$("<a class='btn'>Экспорт</a>").appendTo("div.dict-title-inner").click(function() {
		var wordsList = dict.wordsCat.reduce(function(wordsList, category, i) { 
				return wordsList.concat(category.words.map(function(word) {
					 return word.word_value + ';' + word.user_translates[0].translate_value + ';' + word.user_translates[0].picture_url
		 		}));
			}, new Array()).join('\n');
		
		saveAs(
			new Blob([wordsList], {type: "text/plain;charset=utf-8"}),
			'lingualeo-dict-export.txt'
		);
	});
};


// inject script in page that will send dictionary data using portMessage
var s = document.createElement('script');
s.textContent = "window.postMessage({ type: 'LeoDict', payload: CONFIG.pages.userdict3 }, '*');"
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

