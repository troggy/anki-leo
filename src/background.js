/* global chrome Blob */
chrome.runtime.onMessage.addListener(
  (arg) => {
    if (arg.type && (arg.type === 'ankileo.download')) {
      const resultBlob = new Blob(arg.payload.data, { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(resultBlob)
      chrome.downloads.download({
        url: url,
        filename: arg.payload.name
      })
    }
  }
)
