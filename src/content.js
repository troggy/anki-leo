/* global chrome */

'use strict'

// inject main.js where all the work happens
const script = document.createElement('script')
script.setAttribute('type', 'module')
script.setAttribute('src', chrome.extension.getURL('js/index.js'))
const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
head.insertBefore(script, head.lastChild)

// relay download message to background script
window.addEventListener('message', (event) => {
  if (event.data.type && (event.data.type === 'ankileo.download')) {
    chrome.runtime.sendMessage(event.data)
  }
}, false)

const contentPort = chrome.runtime.connect({
  name: 'ankileo.background-content'
})

console.log('Yo', contentPort)

contentPort.onMessage.addListener((event) => {
  if (event.type === 'ankileo.init') {
    window.postMessage(event)
  }
})
