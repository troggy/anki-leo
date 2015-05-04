di.require(["$tooltip"], function(tooltip) { 

	window.postMessage({ type: 'LeoDict', payload: { wordsCount: CONFIG.pages.userdict3.count_words } }, '*');

	window.addEventListener("message", function(event) {
	  // We only accept messages from ourselves
	  if (event.source != window)
	    return;

	  if (event.data.type && (event.data.type == "LeoExportExtension.ShowTooltip")) {
	  	tooltip.show($("#leo-export-extension-btn"), { content:event.data.payload.message,position: "bottom", styleClass: event.data.payload.style });	
	  }

	  if (event.data.type && (event.data.type == "LeoExportExtension.AddDropdownHideHandler")) {
	  	LEO.ui.BodyClickHider
	  		.removeItem(".leo-export-extension-menu-container")
	  		.addItem(".leo-export-extension-menu-container", function() { $(".leo-export-extension-menu-container").hide(); });
	  }
	}, false);
});