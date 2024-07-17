#!/bin/bash
curl -L -o min-form-swc https://github.com/buelbuel/min-form-swc/releases/latest/download/min-form-swc
chmod +x min-form-swc
./min-form-swc -s ./src/base/BaseElement.js -s ./src/base/ShadowElement.js -s ./src/utils/html.js -s ./src/utils/router.js -f ./dist/dim.js -m ./dist/dim.min.js
git add -A dist
if [ "$1" == "version" ]; then
    git push
    git push --tags
fi