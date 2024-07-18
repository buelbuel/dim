#!/bin/bash

set -e

get_version() {
  grep -oP '"version":\s*"\K[0-9]+\.[0-9]+\.[0-9]+' package.json
}

VERSION=$(get_version)

source .env && export GH_TOKEN

git add -A dist/
git commit -m "Release version $VERSION"
git tag $VERSION
git push
git push --tags
gh release create $VERSION --target main --latest
gh release upload $VERSION ./dist/dim.js ./dist/dim.min.js --clobber --generate-notes --notes "" --title "Release $VERSION" --prerelease false --draft false --verify-tag true