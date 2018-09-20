#!/usr/bin/env bash
echo "Copy dist/ to Apache Server"
cd dist && npm pack &&  mv project-ms-ui-0.0.0.tgz projectmsui.tgz && cp -a projectmsui.tgz /var/www/html/desireplatform/micro-ui-libs/


