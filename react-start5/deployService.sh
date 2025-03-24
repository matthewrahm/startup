#!/bin/bash

# ----------------------
# Parse CLI Arguments
# ----------------------
while getopts k:h:s: flag; do
  case "${flag}" in
    k) key=${OPTARG};;
    h) hostname=${OPTARG};;
    s) service=${OPTARG};;
  esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
  echo -e "\n❌ Missing required parameter.\nSyntax: ./deployService.sh -k <pem key file> -h <hostname> -s <service>\n"
  exit 1
fi

echo -e "\n🚀 Deploying service '\033[1m$service\033[0m' to '\033[1m$hostname\033[0m' using key '\033[1m$key\033[0m'"

# ----------------------
# Step 1: Build project
# ----------------------
echo -e "\n📦 Step 1: Build the distribution package"
rm -rf build dist
mkdir -p build

echo -e "\n📦 Installing dependencies..."
npm install

echo -e "\n⚙️ Building frontend..."
npm run build

# Copy frontend and backend into build/
cp -r dist build/public                      # Frontend build
cp -r src build/src                          # Backend shared logic (🔥 important)
cp service/*.js build                        # Backend entry files
cp service/*.json build                      # Backend configs if any
cp package*.json build                       # package.json and lock file

# ----------------------
# Step 2: SSH + Clear old service
# ----------------------
echo -e "\n🧹 Step 2: Clearing out previous distribution on the target"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/$service
mkdir -p services/$service
ENDSSH

# ----------------------
# Step 3: SCP files to server
# ----------------------
echo -e "\n📤 Step 3: Copying distribution package to the target"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# ----------------------
# Step 4: Start PM2 Process
# ----------------------
echo -e "\n🔁 Step 4: Installing dependencies and restarting PM2"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/$service
npm install

# Restart service with PM2
pm2 delete $service || true
pm2 start server.js --name $service

# Save PM2 state
pm2 save
ENDSSH

# ----------------------
# Step 5: Cleanup
# ----------------------
echo -e "\n🧼 Step 5: Cleaning up local build artifacts"
rm -rf build dist

echo -e "\n✅ Deployment of \033[1m$service\033[0m to \033[1m$hostname\033[0m complete.\n"
