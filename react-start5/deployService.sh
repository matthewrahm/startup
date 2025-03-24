#!/bin/bash

# Parse arguments
while getopts k:h:s: flag; do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

# Validate required arguments
if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    echo -e "\n❌ Missing required parameter."
    echo "Syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>"
    exit 1
fi

echo -e "\n🚀 Deploying service '\033[1m$service\033[0m' to '\033[1m$hostname\033[0m' using key '\033[1m$key\033[0m'"

### Step 1: Build local project
echo -e "\n📦 Step 1: Installing dependencies..."
rm -rf build dist
mkdir -p build

npm install || { echo "❌ npm install failed"; exit 1; }

echo -e "\n⚙️ Building frontend..."
npm run build || { echo "❌ Vite build failed"; exit 1; }

if [ ! -d "dist" ]; then
    echo -e "\n❌ 'dist' folder not found. Vite may not have built properly."
    exit 1
fi

echo -e "\n📂 Organizing build files..."
cp -r dist build/public                         # React frontend
cp service/startup/*.js build                   # Backend JS
cp service/startup/*.json build                 # Backend config (if any)
cp package*.json build                          # Node metadata

### Step 2: Remove old service on server
echo -e "\n🧹 Step 2: Cleaning previous deployment on server..."
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

### Step 3: Upload build to server
echo -e "\n📤 Step 3: Uploading to server..."
scp -r -i "$key" build/* ubuntu@$hostname:services/${service}/

### Step 4: Install and restart on server
echo -e "\n🖥️ Step 4: Installing on server and restarting service..."
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/${service}
npm install

# Restart PM2 cleanly
pm2 delete ${service} || true
pm2 start server.js --name ${service}
pm2 save
ENDSSH

### Step 5: Cleanup
echo -e "\n🧹 Step 5: Cleaning up local build..."
rm -rf build dist

echo -e "\n✅ \033[1mDeployment complete! Visit:\033[0m http://$hostname"
