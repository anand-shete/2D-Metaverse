#!/usr/bin/env bash

set -euo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

APP_DIR="$HOME/metaverse"


echo "=== Deployment Started ==="

if [[ ! -d "$APP_DIR" ]]; then
	echo "App directory not found: $APP_DIR"
	exit 1
fi

cd "$APP_DIR"

if [[ ! -f "package.json" ]]; then
	echo "package.json not found in $APP_DIR"
	exit 1
fi

# change to `src/server.js` if not using typescript, 
# check rootDir and outDir in tsconfig.json
if [[ ! -f "dist/server.js" ]]; then
	echo "Build artifact missing: dist/server.js"
	exit 1
fi

npm ci --omit=dev

pm2 reload metaverse --update-env || pm2 start dist/server.js --name "metaverse"
pm2 save

echo "=== Deployment Finished ==="