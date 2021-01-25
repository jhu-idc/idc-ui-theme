#! /bin/sh

pwd

yarn
yarn build

HAS_DIST=$( git status | grep 'dist/' )

if [ -n "$HAS_DIST" ]
then
  echo "Some build artifacts found, making sure they are added to the commit. ${HAS_DIST}"
  git add packages/*/dist/
  # git commit --amend -C HEAD --no-verify
fi
