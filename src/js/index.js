import dictPageConfig from './dictPageConfig'
import getLeoFilters from './getLeoFilters'
import Locale from './locale'
import LeoApi from './lingualeo/api'
import toCsv from './toCsv'
import Button from './button'

let isWorking

let locale

const api = new LeoApi()

const showToolTip = (message, style) => {
  document.querySelector('#ankileo-btn .ll-leokit__button__content').textContent = message
}

const resetToolTip = () => {
  document.querySelector('#ankileo-btn .ll-leokit__button__content').textContent = locale.t('web_btn_export')
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
    '.ll-sets-words__col .ll-leokit__checkbox__input'
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
        console.log({ selectedWords })
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

const getUserLocale = async () => {
  try {
    return api.getProfile().then(profile => {
      return profile.lang_interface
    })
  } catch (e) {
    console.error(e)
    return Promise.resolve('en')
  }
}

const initExportButton = ({ wordGroup }) => {
  // don't add export button, if there  is no groupId in URL
  if (wordGroup === false) return

  // don't add export button, if there is one already
  if (document.getElementById('ankileo-btn')) return
  if (document.querySelectorAll('div.ll-page-vocabulary__header').length > 0) {
    getUserLocale().then(localeStr => {
      locale = new Locale(localeStr)
      api.getWordCount(wordGroup).then(wordCount =>
        createExportButton(locale, wordCount, wordGroup)
      )
    })
  }
}

let inited = false

const onNewPageElement = (mutationsList) =>
  mutationsList.forEach((m) => {
    if (!inited && m.target.classList[0] === 'll-page-vocabulary') {
      inited = true
      setTimeout(() => {
        const pageConfig = dictPageConfig(window.location.href)
        if (pageConfig) {
          initExportButton(pageConfig)
        }
      }, 500)
    }
  })
const observer = new window.MutationObserver(onNewPageElement)
const pageBody = document.getElementsByTagName('body')[0]
const config = { attributes: false, childList: true, subtree: true }
observer.observe(pageBody, config)

window.addEventListener('message', function (event) {
  // We only accept messages from ourselves
  if (event.source !== window) {
    return
  }

  if (event.data.type === 'ankileo.init') {
    initExportButton(event.data.payload)
  }
}, false)
