---
layout: index_en
---

This extension allows your to export your words from [LinguaLeo](http://lingualeo.com/) in CSV format, so you can use them elsewhere. For instance, you can import them into [Anki](http://ankisrs.net/).

Extension adds "Export" button to the Dictionary pages on Lingualeo website.

## What's exported

- translation
- image URL
- transcription
- usage example (context)
- URL to sound file with pronounciation
- word sets the word is included to
- text for Anki's cloze cards
- association (if any)

## Import into Anki

### Create a deck and card type

You need to create a card type first.

Simple method: open [empty deck file](../LingualeoWords.apkg) in Anki. It will create an empty deck and "Lingualeo Card" card type.

Advanced method: [create card type manually](card-template)

This step is needed just once.

### Add your words

Download your words using the extension. You can safely export all the words every time — there won't be any duplicates as Anki takes care of it automatically. 
Then use "Import file" in Anki with the following settings:

- Type: LinguaLeo Card
- Set "Allow HTML in fields"
- Set "Update existing notes when first field matches"

![Import File](/anki-leo/img/import.png)

Repeat this step to add news words once you have them.
