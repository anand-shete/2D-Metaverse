#!/bin/bash


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

echo "=== Deployment Started ==="

# Preserve .env file
cd ~
mv ~/metaverse/.env ~
rm -r ~/metaverse


# Clone the repository
git clone https://github.com/anand-shete/Metaverse
mv ~/Metaverse/backend ~/metaverse


# Install dependencies
cd metaverse
npm ci
mv ~/.env .


# Cleanup step
rm -rf ~/Metaverse
pm2 delete metaverse || true



# Start new processes
cd metaverse
npm run build
pm2 start npm --name "metaverse" -- start
sudo nginx -s reload

echo "=== Deployment Finished 🎉 ==="