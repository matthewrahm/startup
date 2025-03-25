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
    echo -e "\nMissing required parameter."
    echo -e "Syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n"
    exit 1
fi

echo -e "\n----> Building and deploying service '$service' to '$hostname'\n"

# Step 1: Clean local build folder
rm -rf build
mkdir -p build/public

# Step 2: Install & Build frontend
npm install
npm run build
cp -r dist/* build/public

# Step 3: Copy everything backend-related
cp -r service/* build/
cp -r service/src build/src

# Step 4: Deploy to server
ssh -i "$key" ubuntu@"$hostname" << EOF
rm -rf /home/ubuntu/services/$service
mkdir -p /home/ubuntu/services/$service
EOF

scp -r -i "$key" build/* ubuntu@"$hostname":/home/ubuntu/services/$service

# Step 5: Install backend dependencies & restart PM2
ssh -i "$key" ubuntu@"$hostname" << EOF
cd /home/ubuntu/services/$service
npm install
pm2 restart $service || pm2 start server.js --name $service
EOF

# Step 6: Cleanup
rm -rf build
rm -rf dist

echo -e "\n✅ Deployment complete!"
