var createExportButton = function(data) {
	$("<a class='btn'>Экспорт</a>").appendTo("div.dict-title-inner").click(function() {
		var wordsCSVList = $('.dict-item-word').map(function(i, item) {
				return $(item).data("word-value") + ';' + $(item).find(".translates").text().trim() + ';http:' + $(item).find(".item-word-img").attr("src"); 
			});

		var wordsCSVString = $.makeArray(wordsCSVList).join('\n')
		saveAs(
			new Blob([wordsCSVString], {type: "text/plain;charset=utf-8"}),
			'lingualeo-dict-export.txt'
		);
		alert('Exported words: ' + wordsCSVList.length + ' of ' + data.count_words);
	});
};


// inject script in page that will send dictionary data using portMessage
var s = document.createElement('script');
s.textContent = "window.postMessage({ type: 'LeoDict', payload: { count_words: CONFIG.pages.userdict3.count_words } }, '*');"
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

