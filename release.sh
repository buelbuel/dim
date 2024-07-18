#!/bin/bash

set -e

get_version() {
  grep -oP '"version":\s*"\K[0-9]+\.[0-9]+\.[0-9]+' package.json
}

VERSION=$(get_version)

source .env && export GH_TOKEN

git commit -am "Release version $VERSION"
git tag $VERSION
git push
git push --tags
gh release create $VERSION --target main --latest --generate-notes --notes "" --title "Release $VERSION" --prerelease=false --draft=false
gh release upload $VERSION ./dist/dim.js ./dist/dim.min.js --clobber
