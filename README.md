[![anki-leo](https://raw.githubusercontent.com/troggy/anki-leo/master/resources/webstore/1400x560.png)](#)

# anki-leo:
[![Code Climate](https://codeclimate.com/github/troggy/anki-leo/badges/gpa.svg)](https://codeclimate.com/github/troggy/anki-leo)

> LinguaLeo → CSV → Anki
>
> Chrome extension to export dictionary from [LinguaLeo](http://lingualeo.com/) to CSV/[Anki](http://ankisrs.net/).

Скачайте ваш словарь с [ЛингуаЛео](http://lingualeo.com/) в CSV-формате, пригодном для импорта в [Анки](http://ankisrs.net/).

[![установить anki-leo из chrome web store](https://raw.githubusercontent.com/troggy/anki-leo/master/resources/webstore/ChromeWebStore_Badge_v2_206x58.png)](https://chrome.google.com/webstore/detail/lingualeo-dictionary-expo/mpaohidlipnfnkbogpmanchjfjpdgcml)

# Как пользоваться
1. Установите расширение из [маркета](https://chrome.google.com/webstore/detail/lingualeo-dictionary-expo/mpaohidlipnfnkbogpmanchjfjpdgcml) или из исходников
2. Ищите кнопку «[Скачать](https://raw.githubusercontent.com/troggy/anki-leo/master/resources/webstore/screen-640x400.png)» на страницах словаря и словарных наборов.
3. Загрузите скачанные слова в Анки по [инструкции](http://troggy.github.io/anki-leo/)

# Возможности

Можно скачивать:
- все слова
- выбранные слова
- только неизученные слова
- слова из опеределенного набора — зайдите на страницу набора.
- слова, отфильтрованные Лингуалео (слова/предложения/фразы и новые/на изучении/изученные)

Фильтры можно комбинировать. Например, можно скачать только неизученные фразы из определенного набора и т.п.

# Формат CSV

Одна строка — одно слово.
Поля в CSV файле (порядок сохранен):
- слово
- перевод
- ссылка на картинку (если есть)
- транскрипция
- пример использования (контекст). Само слово заключено в `<b></b>`
- ссылка на mp3-файл с произношением.
- наборы слов, в которые слово входит. Несколько наборов перечисляются через пробел. Пробелы в названии набора заменяются на нижнее подчеркивание (_)
- пример использования (контекст) для карточек [cloze](http://finpapa.ucoz.ru/ankitest-cloze.html). [Пример импорта cloze-карточки в Анки](https://troggy.github.io/anki-leo/img/cloze.png)

# Разработка

````
yarn
````

## Сборка

``yarn start`` - обновляет расширение в папке `build` при изменении кода

## Установка в Хром

Используйте кнопку 'Load unpacked extension' на странице расширений в Хроме и укажите папку `build`

# История изменений:

### 2.5.4
  Fixed:
  - using chrome.downloads instead of FileSaver

### 2.5.3
  Fixed:
  - rebuilt extension with updated FileSaver

### 2.5.2
  Fixed:
  - rebuilt extension with updated deps

### 2.5.1
  Fixed:
  - broken build

### 2.5.0

Features:
  - localize extension interface depending on Lingualeo profile settings. EN and RU supported.

Fixed:
  - export button wasn't shown for non-russian users
  - export button wasn't shown right after login  

2.4.0 Добавлено: текст для cloze-карточек

2.3.1 Исправлено: отстутствие транскрипции отображается как null

2.3.0
  Исправлено:
  - некорректная работа с кавычками (спасибо Ivan Lagunovsky)

  Добавлено:
  - выгрузка наборов/групп, в которые слово входит (спасибо JulyMorning за идею)

2.2.0 - Исправлено: выгрузка слов со спец. символами (скобки, звездочки и т.п.)

2.1.3 - Исправлена обработка переносов строк под Виндоус (спасибо Ivan Lagunovsky)

2.1.2 - Новые иконки

2.1.1 - Предположительно исправлена ошибка со скачиванием, неработающим из-за отсутствия картинки к слову

2.1.0 - Скачивание наборов слов, использование фильтров от Лингуалео, выделение слова в контексте

2.0.2 - Исправлено: добавление слов с абзацами в контексте

2.0.1 - Исправлена проблема со скачиванием выбранных слов, если выбраны все слова. Исправлена проблема с выпадашкой после скачивания.

2.0.0 - Выгрузка произношения, возможность выбора файлов для выгрузки (все, изучаемые, выделенные)

1.10 - Исправлена ошибка: не отображалась кнопка при использовании https (спасибо Alex Tepliashin за находку)

1.9 - Исправлена ошибка: не отображался статус загрузки

1.8 - Исправлена ошибка: не отображался статус загрузки

1.7 - Выгружаются все выбранные вами варианты перевода одного слова

1.6 - Исправлена ошибка: не отображалась кнопка экспорта

1.5 - Исправлена проблема при импорте в Anki слов, в контексте которых есть незакрытая двойная кавычка. Для простоты двойные кавычки теперь заменяются на одинарные

1.4 - В экспорт добавлены транскрипция и контекст (пример предложения)
