#!/bin/bash

# Usage: ./deployService.sh -k <pem-file> -h <host> -s <service-name>

while getopts "k:h:s:" opt; do
  case $opt in
    k) KEY="$OPTARG" ;;
    h) HOST="$OPTARG" ;;
    s) SERVICE="$OPTARG" ;;
    \?) echo "Invalid option -$OPTARG" >&2; exit 1 ;;
  esac
done

if [ -z "$KEY" ] || [ -z "$HOST" ] || [ -z "$SERVICE" ]; then
  echo "Usage: ./deployService.sh -k <pem-file> -h <host> -s <service-name>"
  exit 1
fi

echo
echo "----> Deploying service '$SERVICE' to '$HOST' using key '$KEY'"
echo

# Step 1: Build frontend with Vite (output already goes to build/public)
echo "----> Step 1: Build frontend with Vite"
npm install
npm run build || { echo "❌ Build failed"; exit 1; }

# Step 2: Upload to server
echo
echo "----> Step 2: Upload service files to server"
ssh -i "$KEY" ubuntu@$HOST "mkdir -p ~/services/$SERVICE"
scp -i "$KEY" -r \
  build/public \
  src \
  package.json \
  package-lock.json \
  .env \
  server.js \
  ubuntu@$HOST:~/services/$SERVICE/

# Step 3: Install backend dependencies
echo
echo "----> Step 3: Install backend dependencies on server"
ssh -i "$KEY" ubuntu@$HOST "cd ~/services/$SERVICE && npm install"

# Step 4: Restart PM2
echo
echo "----> Step 4: Restart PM2 process"
ssh -i "$KEY" ubuntu@$HOST "
  pm2 delete $SERVICE || true
  pm2 start server.js --name $SERVICE --cwd ~/services/$SERVICE
  pm2 save
"

echo
echo "✅ Deployment of '$SERVICE' complete!"
