#!/usr/bin/env bash
cp -a src/assets/ dist/
echo "Copied assets folder to dist"
cd dist && npm pack
