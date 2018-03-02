#!/usr/bin/env bash
cp -a src/assets/ dist/
echo "Copied assets folder to dist"
echo "Copy dist/ to Apache Server"
cd dist && npm pack &&  mv projectmsui-0.0.0.tgz projectmsui.tgz && cp -a projectmsui.tgz /var/www/html/desireplatform/micro-ui-libs/


