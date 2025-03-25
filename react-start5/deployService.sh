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

printf "\n----> Deploying service '\033[1m$service\033[0m' to '\033[1m$hostname\033[0m' using key '\033[1m$key\033[0m'\n"

# Step 1: Build
printf "\n----> Step 1: Build the distribution package\n"
rm -rf build dist
mkdir -p build
npm install
npm run build

cp -r dist build/public
cp -r service/startup/* build/
cp -r src build/             # ✅ Include your entire src directory
cp package*.json build/

# Step 2: SSH into target and clear out previous deployment
printf "\n----> Step 2: Clearing previous deployment from server\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Step 3: SCP files to server
printf "\n----> Step 3: Uploading new build to server\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# Step 4: Install & restart with PM2
printf "\n----> Step 4: Installing backend deps and restarting PM2\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/${service}
npm install
pm2 delete ${service} || true
pm2 start server.js --name ${service}
pm2 save
ENDSSH

# Step 5: Clean up
printf "\n----> Step 5: Clean up local build\n"
rm -rf build dist

printf "\n✅ Deployment to \033[1m$hostname\033[0m complete.\n"
