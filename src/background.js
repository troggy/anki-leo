/* global chrome Blob */

import dictPageConfig from './js/dictPageConfig.js'

let contentPort
chrome.runtime.onConnect.addListener(function(portFrom) {
   if(portFrom.name === 'ankileo.background-content') {
      contentPort = portFrom
   }
});

// inject an 'export' button everytime we visit a 'dictionary' page
chrome.webNavigation.onHistoryStateUpdated.addListener(state => {
  const pageConfig = dictPageConfig(state.url);
  if (pageConfig) {
    console.log('Dictionary page is opened', pageConfig)
    contentPort.postMessage({ type: 'ankileo.init', payload: pageConfig })
  }  
})

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