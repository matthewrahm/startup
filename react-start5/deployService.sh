#!/bin/bash

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;      # SSH key file (e.g., crypto.pem)
        h) hostname=${OPTARG};; # Server hostname
        s) service=${OPTARG};;  # Service name (e.g., startup)
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\n❌ Missing required parameter.\n"
    printf "  Syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n🚀 Deploying service $service to $hostname using key $key\n"

# Step 1: Build the project
printf "\n📦 Building the distribution package...\n"
rm -rf build
mkdir -p build/public
mkdir -p build/service

npm install --legacy-peer-deps  # Ensure dependencies are installed

npm run build  # Build the frontend
if [ ! -d "dist" ]; then
    echo "❌ Build failed: 'dist' folder not found. Exiting..."
    exit 1
fi

cp -rf dist/* build/public/  # Move built frontend to correct folder

# Move backend files
cp -rf service/* build/service/

# Step 2: Prepare the target directory
printf "\n🧹 Clearing out previous deployment on the server...\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}/public
mkdir -p services/${service}/service
ENDSSH

# Step 3: Copy the new build to the server
printf "\n📤 Uploading files to the server...\n"
scp -r -i "$key" build/public ubuntu@$hostname:services/$service
scp -r -i "$key" build/service ubuntu@$hostname:services/$service

# Step 4: Install dependencies and restart the service
printf "\n🚀 Deploying the service on the target...\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/${service}
npm install
pm2 restart ${service} || pm2 start service/server.js --name ${service} --watch -- --port 4000
ENDSSH

# Step 5: Clean up local build files
printf "\n🧹 Cleaning up local build files...\n"
rm -rf build
rm -rf dist

printf "\n✅ Deployment successful! Service running on port 4000.\n"
