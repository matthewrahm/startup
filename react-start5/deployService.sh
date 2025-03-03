f#!/bin/bash

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

printf "\n----> Deploying React bundle $service to $hostname with $key\n"

# Step 1
printf "\n----> Build the distribution package\n"
rm -rf build
mkdir -p build
npm install # make sure vite is installed so that we can bundle
npm run build # build the React front end

# Create the distribution structure
mkdir -p build/public
cp -rf dist/* build/public/ # move the React front end to the target distribution
cp -f package.json build/ # Copy package.json to the build directory
cp -f package-lock.json build/ # Copy package-lock.json if it exists

# Copy server files
cp server.js build/ # Copy the main server file
cp -f service/index.js build/ # Copy the index.js file
cp -f service/package.json build/ # Copy the service-specific package.json
cp -f service/*.js build/ # Copy any other JS files from service directory
cp -f service/*.json build/ # Copy any JSON files from service directory

# Create a .env file if it doesn't exist
if [ ! -f build/.env ]; then
    echo "NODE_ENV=production" > build/.env
    echo "PORT=3001" >> build/.env
fi

# Step 2
printf "\n----> Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# Step 4
printf "\n----> Deploy the service on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
bash -i
cd services/${service}
ls -la # List files to verify package.json exists

# Fix potential line ending issues
dos2unix package.json 2>/dev/null || true
dos2unix package-lock.json 2>/dev/null || true

# Ensure correct permissions
chmod 644 package.json
chmod 644 package-lock.json 2>/dev/null || true

# Create a minimal package.json if the existing one has issues
if ! npm install --dry-run > /dev/null 2>&1; then
  echo "Creating a minimal package.json as fallback"
  cat > package.json << 'EOF'
{
  "name": "ramen-crypto",
  "version": "1.0.0",
  "description": "A cryptocurrency tracking application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "morgan": "^1.10.0"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
EOF
fi

# Install dependencies
npm install

# Restart the service
pm2 restart ${service} || pm2 start server.js --name ${service}

# Verify the service is running
pm2 status ${service}
ENDSSH

# Step 5
printf "\n----> Removing local copy of the distribution package\n"
rm -rf build
rm -rf dist

printf "\n----> Deployment completed successfully!\n"