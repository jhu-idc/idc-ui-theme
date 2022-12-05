#!/usr/bin/env bash

pwd

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
