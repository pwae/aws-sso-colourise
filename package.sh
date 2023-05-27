#!/bin/sh

test -e package.zip && rm package.zip
zip package.zip main.js
zip package.zip popup.js
zip package.zip manifest.json
zip package.zip popup.html
zip package.zip icon.png
