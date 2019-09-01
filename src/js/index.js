import dictPageConfig from './dictPageConfig.js'
import getLeoFilters from './getLeoFilters.js'
import Locale from './locale.js'
import LeoApi from './leoApi.js'
import toCsv from './toCsv.js'
import Button from './button.js'

let isWorking

let locale

const getToken = () => {
  const m = document.cookie.match('remember=(.+?)(;|$)')
  return m.length > 1 ? m[1] : ''
}

const api = new LeoApi(getToken())

const showToolTip = (message, style) => {
  document.querySelector('#ankileo-btn .ll-button__content').textContent = message
}

const resetToolTip = () => {
  document.querySelector('#ankileo-btn .ll-button__content').textContent = locale.t('web_btn_export')
}

const download = (filter, groupId, expectedNumberOfWords) => {
  if (isWorking) return
  isWorking = true

  const progressReporter = (exported) =>
    showToolTip(locale.t('web_msg_progress', {
      done: exported,
      total: expectedNumberOfWords
    }))

  api.getWords(groupId, getLeoFilters(), expectedNumberOfWords, filter, progressReporter)
    .then((words) => {
      isWorking = false
      if (words.length > 0) {
        const outfile = toCsv(words)
        window.postMessage({
          type: 'ankileo.download',
          payload: {
            data: [outfile],
            name: 'lingualeo.csv'
          }
        })

        showToolTip(
          `✅ ${words.length}`,
          'success'
        )

        setTimeout(resetToolTip, 2000)
      } else {
        showToolTip(
          locale.t('web_msg_done_nothing'),
          'success'
        )
      }
    })
}

const selectedWordsIds = () => {
  return [].slice.call(document.querySelectorAll(
    '.sets-words__col .ll-leokit__checkbox__input'
  )).filter(a => a.checked).map(a => parseInt(a.id))
}

const selectedFilter = selectedWords => word => selectedWords.indexOf(word.id) > -1

const createExportButton = (locale, totalWordsCount, groupId) => {
  console.log('ankileo', locale, totalWordsCount, groupId)
  const handlers = {
    all: () => download(null, groupId, totalWordsCount),
    new: () => download(word => word.progress < 4, groupId, totalWordsCount),
    selected: () => {
      const allSelected = document.querySelector(
        '.ll-page-vocabulary__filter-col .ll-leokit__checkbox__input'
      ).checked

      let filter, wordCount
      if (allSelected) {
         filter = null
         wordCount = totalWordsCount
      } else {
        const selectedWords = selectedWordsIds()
        filter = selectedFilter(selectedWords)
        wordCount = selectedWords.length
      }

      if (wordCount.length === 0) return

      download(filter, groupId, wordCount)
    }
  }
  const button = new Button(locale, handlers)
  document.querySelector('div.ll-page-vocabulary__filter__action')
    .prepend(button.getDomElement(handlers))
}

const getUserLocale = () => {
  try {
    // Lingualeo sets window['context'] with an inline script
    // however at the runtime window.context is overwritten by something else
    // hacking around it by parsing inline script body
    return [].slice.call(document.querySelectorAll('head script'))
      .find(n =>
        n.textContent.trim().startsWith('window[\'context\']')
      ).textContent.match('"interfaceLang":"(.+?)"')[1]
  } catch (e) {
    console.error(e)
    return 'en'
  }
}

const initExportButton = ({ wordGroup }) => {
  // don't add export button, if there  is no groupId in URL
  if (wordGroup === false) return

  // don't add export button, if there is one already
  if (document.getElementById('ankileo-btn')) return

  if (document.querySelectorAll('div.ll-page-vocabulary__header').length > 0) {
    locale = new Locale(getUserLocale())
    api.getWordCount(wordGroup).then(wordCount =>
      createExportButton(locale, wordCount, wordGroup)
    )
  }
}

const pageConfig = dictPageConfig(window.location.href)
if (pageConfig) {
  initExportButton(pageConfig)
}

window.addEventListener('message', function (event) {
  // We only accept messages from ourselves
  if (event.source !== window) {
    return
  }

  if (event.data.type === 'ankileo.init') {
    initExportButton(event.data.payload)
  }
}, false)
