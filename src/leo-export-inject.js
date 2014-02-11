window.postMessage({ type: 'LeoDict', payload: { wordsCount: CONFIG.pages.userdict3.count_words, serverHash: CONFIG_GLOBAL.serverHash } }, '*');

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "LeoExportExtension.Message")) {
  	LEO.ToolTip.show($("#leo-export-extension-button"), event.data.payload.message, "bottom", event.data.payload.style);	
  }
}, false);
