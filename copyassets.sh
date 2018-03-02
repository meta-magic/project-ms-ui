#!/usr/bin/env bash
cp -a src/assets/ dist/
echo "Copied assets folder to dist"
echo "Copy dist/ to Apache Server"
cd dist && npm pack && cp -a projectmsui-0.0.0.tgz /var/www/html/desireplatform/

