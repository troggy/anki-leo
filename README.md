[![anki-leo](https://raw.githubusercontent.com/troggy/anki-leo/master/resources/webstore/1400x560.png)](#)

# AnkiLeo [![Code Climate](https://codeclimate.com/github/troggy/anki-leo/badges/gpa.svg)](https://codeclimate.com/github/troggy/anki-leo) [![Greenkeeper badge](https://badges.greenkeeper.io/troggy/anki-leo.svg)](https://greenkeeper.io/)

## Chrome extension to export dictionary from [LinguaLeo](http://lingualeo.com/) to CSV/[Anki](http://ankisrs.net/).

[![install from chrome web store](https://raw.githubusercontent.com/troggy/anki-leo/master/resources/webstore/ChromeWebStore_Badge_v2_206x58.png)](https://chrome.google.com/webstore/detail/lingualeo-dictionary-expo/mpaohidlipnfnkbogpmanchjfjpdgcml)

# How to use

1. Install extension
2. Use "[Export](https://raw.githubusercontent.com/troggy/anki-leo/master/resources/webstore/screen-640x400.png)" button on a dictionary pages of Lingualeo
3. Import your words into Anki. Guide: [ru](http://troggy.github.io/anki-leo/), en

# Features

- supports all the build-in Lingualeo dictionary filters
- works on word sets pages as well
- adds additional filters:
  - all words
  - selected words
  - words not fully learned yet (new + in progress)

# Export file format

Dictionary is exported in CSV format. One word per line.

Fields:
- word
- translation
- link to the image (if any) as `<img src='http://...'>`
- transcription
- context (if any) with target word enclosed in `<b></b>`
- link to the sound file with pronounciation as `[sound:http://...]`
- sets the word is included to
- context for [cloze](http://finpapa.ucoz.ru/ankitest-cloze.html) cards

# Development

1. Install dependencies

   ```sh
   yarn
   ```

2. Build and watch for changes

   ```sh
   yarn start
   ```

3. In Chrome/Brave, load unpacked extension from `build` folder

# Changelog

[CHANGELOG](CHANGELOG.md)
