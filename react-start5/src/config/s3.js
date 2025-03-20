import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Validate AWS credentials
const validateAWSCredentials = () => {
  const required = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required AWS credentials: ${missing.join(', ')}`);
  }
};

// Initialize S3 client with retry configuration
const createS3Client = () => {
  validateAWSCredentials();
  
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    maxAttempts: 3,
    retryMode: 'adaptive'
  });
};

export const s3Client = createS3Client();
export const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Test S3 connection
const testS3Connection = async () => {
  try {
    await s3Client.config.credentials();
    console.log('AWS S3 credentials validated successfully');
  } catch (error) {
    console.error('Error validating AWS S3 credentials:', error);
    throw error;
  }
};

testS3Connection().catch(console.error);