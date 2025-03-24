#!/bin/bash

# Parse command line flags
while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

# Check for required arguments
if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\n\033[1;31m❌ Missing required parameter.\033[0m\n"
    printf "  syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n\033[1;36m----> Deploying service '\033[1m$service\033[0m' to '\033[1m$hostname\033[0m' using key '\033[1m$key\033[0m'\033[0m\n"

### Step 1: Build
printf "\n\033[1;33m----> Step 1: Build the distribution package\033[0m\n"
rm -rf build dist
mkdir -p build

echo "📦 Installing dependencies..."
npm install || { echo "❌ npm install failed"; exit 1; }

echo "⚙️ Building frontend..."
npm run build || { echo "❌ npm run build failed"; exit 1; }

if [ ! -d "dist" ]; then
    echo "❌ Vite build failed — 'dist' folder not found."
    exit 1
fi

# Copy frontend build
mkdir -p build/public
cp -r dist/* build/public

# Copy backend files
cp service/*.js build/
cp service/*.json build/
cp package*.json build/

### Step 2: Clear old remote service
printf "\n\033[1;33m----> Step 2: Clearing previous distribution on the target\033[0m\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

### Step 3: Upload to server
printf "\n\033[1;33m----> Step 3: Copying new build to the target\033[0m\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

### Step 4: Install and restart PM2
printf "\n\033[1;33m----> Step 4: Installing dependencies and restarting PM2\033[0m\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/${service}
npm install

# Kill old instance if it exists
pm2 delete ${service} || true

# Start new one
pm2 start server.js --name ${service}

# Save PM2 config
pm2 save
ENDSSH

### Step 5: Cleanup
printf "\n\033[1;33m----> Step 5: Cleanup\033[0m\n"
rm -rf build dist

printf "\n✅ \033[1;32mDeployment complete:\033[0m http://${hostname}\n\n"
