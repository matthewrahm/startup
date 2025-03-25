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

# Step 1: Build
printf "\n----> Building front-end\n"
rm -rf build
mkdir -p build/public
npm install
npm run build
cp -r dist/* build/public
cp -r service/*.js service/*.json build/
cp -r src build/  # ✅ INCLUDE the src folder!

# Step 2: Upload
printf "\n----> Uploading to server\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/$service
mkdir -p services/$service
ENDSSH

scp -r -i "$key" build/* ubuntu@$hostname:/home/ubuntu/services/$service

# Step 3: Start service
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd /home/ubuntu/services/$service
npm install
pm2 restart $service || pm2 start server.js --name $service
ENDSSH

# Step 4: Cleanup
rm -rf build dist
