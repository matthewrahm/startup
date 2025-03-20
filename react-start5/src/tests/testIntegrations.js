import mongoose from 'mongoose';
import { s3Client, BUCKET_NAME } from '../config/s3.js';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const testMongoDB = async () => {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test database connection
    const conn = await connectDB();
    console.log(`✅ MongoDB connection successful - Connected to: ${conn.connection.host}`);

    // Test user creation
    const testUser = new User({
      email: 'test@example.com',
      password: 'testpassword123'
    });

    await testUser.save();
    console.log('✅ MongoDB user creation successful');

    // Verify user was created
    const savedUser = await User.findOne({ email: 'test@example.com' });
    if (!savedUser) {
      throw new Error('User verification failed');
    }
    console.log('✅ MongoDB user verification successful');

    // Clean up
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ MongoDB cleanup successful');

    return true;
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

const testS3 = async () => {
  try {
    console.log('Testing AWS S3 connection...');
    
    // Test file upload
    const testData = {
      message: 'Test data',
      timestamp: new Date().toISOString()
    };

    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'test/test-file.json',
      Body: JSON.stringify(testData),
      ContentType: 'application/json'
    });

    await s3Client.send(putCommand);
    console.log('✅ S3 file upload successful');

    // Test file retrieval
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'test/test-file.json'
    });

    const response = await s3Client.send(getCommand);
    const retrievedData = await response.Body.transformToString();
    const parsedData = JSON.parse(retrievedData);
    
    // Verify retrieved data
    if (parsedData.message !== testData.message) {
      throw new Error('Data verification failed');
    }
    console.log('✅ S3 file retrieval and verification successful');

    // Clean up
    const deleteCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'test/test-file.json',
      Body: ''
    });
    
    await s3Client.send(deleteCommand);
    console.log('✅ S3 cleanup successful');

    return true;
  } catch (error) {
    console.error('❌ AWS S3 test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

const runTests = async () => {
  console.log('🚀 Starting integration tests...\n');

  try {
    const mongoResult = await testMongoDB();
    console.log('\nMongoDB Test Result:', mongoResult ? '✅ PASSED' : '❌ FAILED');

    const s3Result = await testS3();
    console.log('\nAWS S3 Test Result:', s3Result ? '✅ PASSED' : '❌ FAILED');

    // Clean up connections
    await mongoose.connection.close();
    
    console.log('\n🏁 Integration tests completed');
    
    // Exit with appropriate status code
    process.exit(mongoResult && s3Result ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Tests failed with uncaught error:', error);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

runTests().catch((error) => {
  console.error('Error running tests:', error);
  process.exit(1);
});