chrome.runtime.onMessage.addListener(
  function(arg, sender, sendResponse) {
    if (arg.type && (arg.type === "LeoExportExtension.DownloadCSV")) {
      var resultBlob = new Blob(arg.payload, { type: "text/plain;charset=utf-8" })
      var url = URL.createObjectURL(resultBlob);
      chrome.downloads.download({
        url: url,
        filename: 'lingualeo-dict-export.csv'
      });
    }
  }
);
