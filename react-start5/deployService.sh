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
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying React bundle \033[1m$service\033[0m to \033[1m$hostname\033[0m with \033[1m$key\033[0m\n"

# Step 1: Build
printf "\n----> Step 1: Build the distribution package\n"
rm -rf build dist
mkdir -p build

# Install dependencies and build frontend
npm install
npm run build

# Move necessary files to the build directory
cp -r dist build/public
cp -r service build/service
cp -r src build/src
cp package*.json build

# Step 2: SSH into target and prepare
printf "\n----> Step 2: Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Step 3: Copy to server
printf "\n----> Step 3: Copying distribution package to the target\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# Step 4: SSH in again and start server
printf "\n----> Step 4: Installing dependencies and restarting PM2\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/${service}
npm install

# Stop and delete old PM2 process if running
pm2 delete ${service} || true

# Start the backend (adjust this if your entry file is different)
pm2 start service/startup/server.js --name ${service}

# Save PM2 process list
pm2 save
ENDSSH

# Step 5: Clean up
printf "\n----> Step 5: Cleaning up local build artifacts\n"
rm -rf build dist

printf "\n✅ Deployment of \033[1m$service\033[0m to \033[1m$hostname\033[0m complete.\n"
