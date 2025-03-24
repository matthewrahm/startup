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
npm install
npm run build

mkdir -p build/public
cp -r dist/* build/public/
cp service/*.js build/
cp service/*.json build/
cp -r src build/src/
cp package*.json build/

# Step 2: SSH in and prepare the server
printf "\n----> Step 2: SSH into server and prepare directories\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Step 3: Copy files over
printf "\n----> Step 3: SCP files to server\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# Step 4: Install dependencies & start PM2
printf "\n----> Step 4: Install dependencies and start PM2\n"
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

printf "\n✅ Deployment complete!\n"
