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
echo "Installing dependencies..."
npm install
echo "Building frontend..."
npm run build

# Step 3: Copy all necessary files
echo "Copying files to build directory..."
cp -r dist/* build/public
cp package.json package-lock.json build/
cp server.js build/
cp ecosystem.config.js build/
cp .env build/
cp dbConfig.json build/
cp aws.js build/
cp multer.js build/
cp -r src build/src

# Step 4: Deploy to server
echo "Deploying to server..."
ssh -i "$key" ubuntu@"$hostname" << EOF
rm -rf /home/ubuntu/services/$service
mkdir -p /home/ubuntu/services/$service
EOF

scp -r -i "$key" build/* ubuntu@"$hostname":/home/ubuntu/services/$service

# Step 5: Install backend dependencies & restart PM2
echo "Installing dependencies and restarting service..."
ssh -i "$key" ubuntu@"$hostname" << EOF
cd /home/ubuntu/services/$service
npm install --production
pm2 delete $service 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
EOF

# Step 6: Cleanup
echo "Cleaning up..."
rm -rf build
rm -rf dist

echo -e "\n✅ Deployment complete!"
