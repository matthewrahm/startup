#!/bin/bash

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};; # AWS Key
        h) hostname=${OPTARG};; # Host (ramencrypto.click)
        s) service=${OPTARG};; # Service (startup)
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployFiles.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying files for $service to $hostname with $key\n"

# Step 1: Clear out the previous distribution on the server
printf "\n----> Clearing previous distribution on the target server.\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
    rm -rf /home/ubuntu/services/${service}/public
    mkdir -p /home/ubuntu/services/${service}/public
ENDSSH

# Step 2: Copy the distribution package to the server
printf "\n----> Copying distribution package to the server.\n"
scp -r -i "$key" /c/Users/GamingPC/CODE/cs260/startup/html/* ubuntu@$hostname:/home/ubuntu/services/${service}/public/

printf "\n----> Deployment Complete!\n"
