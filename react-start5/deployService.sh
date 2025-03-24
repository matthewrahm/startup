#!/bin/bash

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\n❌ Missing required parameter.\n"
    printf "   Usage: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n🚀 Deploying service '\033[1m$service\033[0m' to '\033[1m$hostname\033[0m' using key '\033[1m$key\033[0m'\n"

# Step 1: Build
printf "\n🔧 Step 1: Build the distribution package\n"
rm -rf build dist
mkdir -p build

echo "📦 Installing dependencies..."
npm install

echo "⚙️ Building frontend..."
npm run build

# Copy frontend + backend files
cp -r dist build/public                       # Frontend output
cp service/*.js build                         # Backend service files
cp service/*.json build                       # Backend JSON configs
cp -r src build                               # ✅ Ensure src/ is included (config files, etc)
cp package*.json build                        # npm install needs these
cp .env build

# Step 2: SSH into target and clear out previous deployment
printf "\n🧹 Step 2: Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Step 3: SCP files to target
printf "\n📤 Step 3: Copying distribution package to the target\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# Step 4: Install & restart via PM2
printf "\n🔄 Step 4: Installing dependencies and restarting PM2\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/${service}
npm install

# Stop and remove previous PM2 instance
pm2 delete ${service} || true

# Start service (update this if entry point changes)
pm2 start server.js --name ${service}

# Persist PM2 state across restarts
pm2 save
ENDSSH

# Step 5: Clean up
printf "\n🧼 Step 5: Cleaning up local build artifacts\n"
rm -rf build dist

printf "\n✅ Deployment of '\033[1m$service\033[0m' to '\033[1m$hostname\033[0m' complete.\n"
