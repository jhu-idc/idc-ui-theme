#!/usr/bin/env bash

[ ! -x "$(command -v nvm)" ] && node -v
[ -f "package.json" ] && echo "✓ Found package.json"
[ ! -f "package.json" ] && echo "✘ No package.json file."

# # Chekc is node version is 12
# [ "$(node -v)" = "v12.22.5" ] && echo "✓ Node version is v12.22.5"
# [ "$(node -v)" != "v12.22.5" ] && echo "✘ Wrong Node version ( $(node -v) )" ; exit 1

corepack enable

yarn
yarn build
npx lerna run --stream build

# If in the js folder, cd up one level
if [ -d "packages" ]
then
  cd ..
fi

HAS_DIST=$( git status | grep 'dist/' )

if [ -n "$HAS_DIST" ]
then
  echo "Some build artifacts found, making sure they are added to the commit. ${HAS_DIST}"
  git add js/packages/*/dist/
  # git commit --amend -C HEAD --no-verify
fi
