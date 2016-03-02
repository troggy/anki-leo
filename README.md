#Anki-leo
[![Code Climate](https://codeclimate.com/github/troggy/anki-leo/badges/gpa.svg)](https://codeclimate.com/github/troggy/anki-leo)

![](https://raw.githubusercontent.com/troggy/anki-leo/master/resources/webstore/440x280.png)

**Chrome extension to export dictionary from [LinguaLeo](http://lingualeo.com/) as CSV file usable for [Anki](http://ankisrs.net/).**

**http://troggy.github.io/anki-leo/**




Once installed it adds Download button on [dictionary page](http://lingualeo.com/userdict).

![Export button in UI](https://raw.githubusercontent.com/troggy/anki-leo/master/resources/webstore/screen-640x400.png "Export button is being added to LinguaLeo UI")

Installation
============

Install it from Chrome WebStore:
https://chrome.google.com/webstore/detail/lingualeo-dictionary-expo/mpaohidlipnfnkbogpmanchjfjpdgcml

Import to Anki
==============
http://troggy.github.io/anki-leo/

Development
===========

You will need [npm](https://www.npmjs.com/) and [Bower](http://bower.io/).

Install it as unpacked extension:

1. ``git clone https://github.com/troggy/anki-leo.git``
2. ``npm install``
3. ``bower install``
4. ``gulp build``
5. Go to Chrome -> Tools -> Extensions
6. Check 'Developer mode'
7. Click 'Load unpacked extension' and point to the 'build' folder of the repo
