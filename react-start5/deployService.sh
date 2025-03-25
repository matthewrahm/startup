#!/bin/bash

while getopts k:h:s: flag; do
  case "${flag}" in
    k) key=${OPTARG};;
    h) hostname=${OPTARG};;
    s) service=${OPTARG};;
  esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
  echo "Missing required parameter."
  echo "syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>"
  exit 1
fi

echo "----> Deploying service '$service' to '$hostname' using key '$key'"

# Step 1: Build frontend
echo "----> Step 1: Build frontend with Vite"
rm -rf build dist
npm install
npm run build

# Create build folder and move frontend
mkdir -p build/public
cp -r dist/* build/public

# Step 2: Copy backend files
echo "----> Step 2: Copy backend files"
cp service/startup/*.js build/
cp service/startup/*.json build/
cp package*.json build/
cp -r src build/

# Step 3: SSH into server and prepare
echo "----> Step 3: Clean remote and prepare folder"
ssh -i "$key" ubuntu@$hostname << ENDSSH
  rm -rf services/${service}
  mkdir -p services/${service}
ENDSSH

# Step 4: SCP to remote
echo "----> Step 4: Uploading project to server"
scp -i "$key" -r build/* ubuntu@$hostname:services/$service

# Step 5: Install & Start with PM2
echo "----> Step 5: Install & start service with PM2"
ssh -i "$key" ubuntu@$hostname << ENDSSH
  cd services/$service
  npm install

  # Optional: Export .env vars if needed
  export NODE_ENV=production

  pm2 delete $service || true
  pm2 start server.js --name $service
  pm2 save
ENDSSH

# Step 6: Clean up
echo "----> Step 6: Clean up local build"
rm -rf build dist

echo "✅ Deployment complete for $service to $hostname"
