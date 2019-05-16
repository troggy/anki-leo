/* global LEO CONFIG CONFIG_GLOBAL di */

import fetchWordsFromLeo from './fetchWordsFromLeo.js'
import translations from '../translations.js'
import dictPageConfig from './dictPageConfig.js'
import Locale from './locale.js'
import LeoApi from './leoApi.js'
import toCsv from './toCsv.js'
import Button from './button.js';

let isWorking

let wordSetsMap = []

let locale

let leoTooltip

let api

const mapWordSets = (wordSets) => {
  return wordSets.reduce((map, wordSet) => {
    map[wordSet.id] = wordSet.name.replace(/\s/gi, '_')
    return map
  }, {})
}

const showToolTip = (message, style) => {
  leoTooltip.show(document.getElementById('leo-export-extension-btn'), {
    content: message,
    position: 'bottom',
    styleClass: style
  })
}

const download = (filter, groupId, expectedNumberOfWords) => {
  if (isWorking) return
  isWorking = true

  const wordType = document.querySelector('.word-type-btn.selected').dataset
    .wordType
  const leoFilter = document.querySelector('.dict-filter button.selected')
    .dataset.filter

  const progressReporter = (exported) =>
    showToolTip(
      locale.t('Exporting words', {
        done: exported,
        total: expectedNumberOfWords
      })
    )

  fetchWordsFromLeo(filter, groupId, expectedNumberOfWords, wordType, leoFilter, progressReporter)
    .then(function (words) {
      if (words.length === 0) {
        showToolTip(locale.t('Nothing to export'), 'success')
      } else {
        const outfile = toCsv(words, wordSetsMap)
        window.postMessage({
          type: 'ankileo.download',
          payload: {
            data: [outfile],
            name: 'lingualeo.csv'
          }
        })

        showToolTip(
          locale.t('Export complete', { total: words.length }),
          'success'
        )
      }
      isWorking = false
    })
}

const selectedWordsIds = () => {
  return Array.prototype.map.call(
    document.querySelectorAll('div.dict-item-word.checked'),
    n => Number(n.dataset.wordId)
  )
}

const progressFilter = {
  all: () => true,
  no_translate: word => word.progress_percent === 0,
  learning: word => word.progress_percent < 100,
  learned: word => word.progress_percent === 100
}

const selectedFilter = selectedWords => word => selectedWords.indexOf(word.word_id) > -1

const createExportButton = (locale, totalWordsCount, groupId) => {
  const handlers = {
    all: () => {
      download(progressFilter.all, groupId, totalWordsCount)
    },
    new: () => {
      download(progressFilter.learning, groupId, totalWordsCount)
    },
    selected: () => {
      const selectedWords = selectedWordsIds()
      if (selectedWords.length === 0) return

      const allSelected = !!document.querySelector(
        'span.checkbox-word-con.checked'
      )
      const filterName = document.querySelector('.dict-filter button.selected')
        .dataset.filter
      const selectedWordsCount = document.querySelector('.dict-search-count')
        .textContent

      const filter = allSelected
        ? progressFilter[filterName]
        : selectedFilter(selectedWords)
      download(filter, groupId, selectedWordsCount)
    }
  };
  const button = new Button(locale, handlers);
  document.querySelector('div.ll-page-vocabulary__filter__action')
    .prepend(button.getDomElement(handlers));

}

const getToken = () => {
  const m = document.cookie.match('remember=(.+?);');
  return m.length > 1 ? m[1] : '';
}

const initExportButton = ({ wordGroup, localeName }) => {
  // don't add export button, if there  is no groupId in URL
  if (wordGroup === false) return

  if (document.querySelectorAll('div.ll-page-vocabulary__header').length > 0) {
    //wordSetsMap = mapWordSets(CONFIG.pages.glossary.wordSets)
    locale = new Locale(localeName, translations)
    api.getWordCount(wordGroup).then(wordCount => 
      createExportButton(locale, wordCount, wordGroup)      
    )
  }
}

api = new LeoApi(getToken())

const pageConfig = dictPageConfig(window.location.href)
if (pageConfig) {
  initExportButton(pageConfig)
}

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source !== window) {
    return
  }

  if (event.data.type === 'ankileo.init') {
    initExportButton(event.data.payload)
  }
}, false);