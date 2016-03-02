var pageMatcher = LeoExport.PageWithWordsMatcher;

var getWordCount = function() {
	if (typeof CONFIG.pages.glossary.wordSets !== 'undefined') {
		return CONFIG.pages.glossary
										.wordSets.filter(function(g) {
												return g.name === $(".dict-title-main").text();
										})[0].countWords;
	} else {
		return CONFIG.pages.userdict3.count_words;
	}
};

var initExportButton = function() {
	var groupId = pageMatcher.getWordGroupId(window.location.pathname);
	// don't add export button, if there is no groupId in URL
	if (groupId === false) return;

	if ($("div.dict-title-inner").length > 0) {
		window.postMessage({ type: 'LeoDict', payload: { wordsCount: getWordCount(), groupId: groupId } }, '*');
	}
};

di.require(["$tooltip"], function(tooltip) {

	initExportButton();

  // add handlers for history API
	for (var i = 0; i < pageMatcher.targetUrls.length; i++) {
		LEO.HistoryListener.addListener({
			regEx: new RegExp(pageMatcher.targetUrls[i]),
			listener: initExportButton, name:"leoExport" + i,format: pageMatcher.targetUrls[i]});
	}

	window.addEventListener("message", function(event) {
	  // We only accept messages from ourselves
	  if (event.source !== window)
	    return;

	  if (event.data.type && (event.data.type === "LeoExportExtension.ShowTooltip")) {
	  	tooltip.show($("#leo-export-extension-btn"), { content:event.data.payload.message,position: "bottom", styleClass: event.data.payload.style });
	  }

	  if (event.data.type && (event.data.type === "LeoExportExtension.AddDropdownHideHandler")) {
	  	LEO.ui.BodyClickHider
	  		.removeItem(".leo-export-extension-menu-container")
	  		.addItem(".leo-export-extension-menu-container", function() { $(".leo-export-extension-menu-container").hide(); });
	  }
	}, false);
});
