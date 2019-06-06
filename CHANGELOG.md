# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.3.2](https://github.com/troggy/anki-leo/compare/v3.3.1...v3.3.2) (2019-06-06)


### Bug Fixes

* guard against empty translation ([#35](https://github.com/troggy/anki-leo/issues/35)) ([949f04d](https://github.com/troggy/anki-leo/commit/949f04d)), closes [#34](https://github.com/troggy/anki-leo/issues/34)



### [3.3.1](https://github.com/troggy/anki-leo/compare/v3.3.0...v3.3.1) (2019-05-20)


### Bug Fixes

* handle words with no translation (seems like this could be the case) ([e8c5428](https://github.com/troggy/anki-leo/commit/e8c5428))



## [3.3.0](https://github.com/troggy/anki-leo/compare/v3.2.1...v3.3.0) (2019-05-19)


### Features

* use Chrome i18n for localization ([ba34073](https://github.com/troggy/anki-leo/commit/ba34073))



### [3.2.1](https://github.com/troggy/anki-leo/compare/v3.2.0...v3.2.1) (2019-05-19)


### Bug Fixes

* fallback to 'en' in case of missing extension locale ([b1d5480](https://github.com/troggy/anki-leo/commit/b1d5480))



## [3.2.0](https://github.com/troggy/anki-leo/compare/v3.0.1...v3.2.0) (2019-05-19)


### Bug Fixes

* properly handle json-like word contexts ([2e8b0f0](https://github.com/troggy/anki-leo/commit/2e8b0f0))


### Features

* trying to figure out user translations only ([e547c06](https://github.com/troggy/anki-leo/commit/e547c06))



## [3.1.0](https://github.com/troggy/anki-leo/compare/v3.0.1...v3.1.0) (2019-05-19)


### Bug Fixes

* don't add the button if there is one on the page already ([0edbf2a](https://github.com/troggy/anki-leo/commit/0edbf2a))
* don't fail on json-like context strings ([0a31efb](https://github.com/troggy/anki-leo/commit/0a31efb))
* error reading error cookie ([de6fb74](https://github.com/troggy/anki-leo/commit/de6fb74))


### Features

* detecting user locale (hack) ([3c2177e](https://github.com/troggy/anki-leo/commit/3c2177e))



## [3.0.1] - 2019-05-18

### Fixed
- Export button is not shown on word set pages (other than my/jungle/internet)

## [3.0.0] - 2019-05-17

Major code rework

### Fixed
- Support latest Lingualeo API and website changes #30

### Changed
- Image attribute value is now wrapped in <img> #29


## [2.5.4] - 2018-03-13

### Fixed

- Extension stopped working in Chrome 65 released lately.

  Possible cause: Chrome 65 fixed to some CSP vulnerabilities. Apparently anki-leo used one of those to download CSV as blob and "blob:" is not in CSP of lingualeo.com.
  
  Problem solved by downloading from extension's background page.

### Changed
- now using native chrome.downloads instead of FileSaver.js

## [2.5.3] - 2018-03-13

### Fixed
- rebuilt extension with updated FileSaver

## [2.5.2] - 2018-03-13

### Fixed
- rebuilt extension with updated deps

## [2.5.1] - 2017-01-15

### Fixed
- broken build

## [2.5.0] - 2017-01-15

### Added
- localize extension interface depending on Lingualeo profile settings. EN and RU supported.

### Fixed
- export button wasn't shown for non-russian users
- export button wasn't shown right after login  

## [2.4.0] - 2017-01-05

### Added
- текст для cloze-карточек (#13)

## [2.3.1] - 2017-01-05

### Fixed
- отстутствие транскрипции отображается как null

## [2.3.0] - 2017-01-05

### Added
- выгрузка наборов/групп, в которые слово входит (спасибо JulyMorning за идею)

### Fixed
- некорректная работа с кавычками (спасибо Ivan Lagunovsky)

## [2.2.0] - 2017-01-05

### Fixed
- выгрузка слов со спец. символами (скобки, звездочки и т.п.)

## [2.1.3] - 2016-08-16

### Fixed
- Fixed newline handling for Windows (thanks to Ivan Lagunovsky)

## [2.1.2] - 2016-02-26

### Added
- New icons and marketing images by Interes.design

## [2.1.1] - 2015-10-19

### Fixed
- Ошибка со скачиванием, неработающим из-за отсутствия картинки к слову

## [2.1.0] - 2015-06-15

### Added

- Возможность экспорта наборов слов. Кнопка выгрузки теперь доступна на всех страницах, где есть слова.
- Учитываются встроенные фильтры Лингуалео: фильтр по типу (слово, фраза, предложение) и фильтр по степени изученности (новые, на изучении, изученные)
- В выгруженном файле слово выделяется в примере использования (контексте) тэгом
- Обрабатывается ситуация, когда нет подходящих слов. Раньше выгружался пустой файл

## [2.0.2] - 2015-05-07

### Fixed

- добавление слов с абзацами и двойными кавычками в контексте

## [2.0.1] - 2015-05-05

### Fixed

- скачивание выбранных слов, если отмечена галочка «выбрать все»
- глюк с непоявлением меню при повторном скачивании

## [2.0.0] - 2015-05-05

### Added

- Добавлена возможность выгружать выбранные слова или только слова на изучении
- Выгружаются ссылки на аудиофайлы с произношением

### Changed
- Переименована кнопка

### Minor
- Переработан код

## [1.10] - 2015-03-16

### Fixed

- не отображалась кнопка при использовании https (спасибо Alex Tepliashin за находку)

## [1.9] - 2015-03-07

### Fixed

- не отображался статус загрузки

## [1.8] - 2015-03-07

### Fixed

- не отображался статус загрузки

## [1.7] - 2015-01-14

### Added

- выгрузка всех вариантов переводов, выбранных пользователем (для контекстных переводов)

## [1.6] - 2015-01-14

### Fixed

- не отображалась кнопка экспорта

## [1.5] - 2014-03-20

### Fixed

- Исправлена проблема при импорте в Anki слов, в контексте которых есть незакрытая двойная кавычка. Для простоты двойные кавычки теперь заменяются на одинарные

## [1.4] - 2014-03-11

### Added

- транскрипция и контекст (пример предложения)

## [1.0] - 2014-02-11

Very first version