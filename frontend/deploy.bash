#!/bin/bash
ng build
scp -r dist/rotapro "$1"@85.234.106.147:/var/www/html
ssh "$1"@85.234.106.147 'sudo -S nginx -s reload'
