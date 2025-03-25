#!/bin/bash

while getopts ":k:h:s:" opt; do
  case $opt in
    k) KEY="$OPTARG"
    ;;
    h) HOST="$OPTARG"
    ;;
    s) SERVICE="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    exit 1
    ;;
  esac
done

echo ""
echo "----> Deploying service '$SERVICE' to '$HOST' using key '$KEY'"
echo ""

#### 1. Build frontend
echo "----> Step 1: Build the frontend"
npm install
npm run build

# Check if dist/ was created
if [ ! -d "dist" ]; then
  echo "❌ Build failed — dist/ not found. Exiting..."
  exit 1
fi

#### 2. Upload to server
echo ""
echo "----> Step 2: Upload files to server"
scp -r . "$KEY" ubuntu@"$HOST":/home/ubuntu/services/"$SERVICE"

#### 3. SSH into server and restart PM2
echo ""
echo "----> Step 3: Restarting service on server..."
ssh -i "$KEY" ubuntu@"$HOST" << EOF
  cd /home/ubuntu/services/"$SERVICE"
  npm install
  pm2 restart startup || pm2 start server.js --name startup
EOF

echo ""
echo "✅ Deployment complete!"
