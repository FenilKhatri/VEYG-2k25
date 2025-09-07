/**
 * Google Sheets Integration Test Script
 * 
 * This script tests the Google Sheets integration by:
 * 1. Testing connection to Google Sheets
 * 2. Creating a sample registration
 * 3. Testing the appendRegistrationRow function
 * 4. Testing the admin retry endpoint
 */

const mongoose = require('mongoose');
const GameRegistration = require('../models/GameRegistration');
const sheetsService = require('../services/googleSheets');
require('dotenv').config();

// Sample registration data for testing
const sampleRegistration = {
  userId: new mongoose.Types.ObjectId(),
  gameId: 'algo-cricket',
  gameName: 'Algo Cricket',
  registrationType: 'team',
  teamName: 'Test Warriors',
  teamLeader: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    enrollmentNumber: 'TEST001',
    contactNumber: '+91-9876543210',
    collegeName: 'Saffrony Institute of Technology',
    semester: '5',
    branch: 'Computer Engineering',
    gender: 'Male',
    degree: 'B.Tech'
  },
  teamMembers: [
    {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      enrollmentNumber: 'TEST002',
      contactNumber: '+91-9876543211',
      collegeName: 'Saffrony Institute of Technology',
      semester: '5',
      branch: 'Computer Engineering',
      gender: 'Female',
      degree: 'B.Tech'
    },
    {
      fullName: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      enrollmentNumber: 'TEST003',
      contactNumber: '+91-9876543212',
      collegeName: 'Saffrony Institute of Technology',
      semester: '5',
      branch: 'Computer Engineering',
      gender: 'Male',
      degree: 'B.Tech'
    }
  ],
  teamSize: 3,
  gameDay: 'Day 1',
  gameCategory: 'technical',
  specialRequirements: 'Need projector for presentation',
  paymentStatus: 'pending',
  approvalStatus: 'pending',
  totalFee: 500,
  registrationId: `TEST-${Date.now()}`,
  receiptNumber: `RCP-${Date.now()}`,
  pdfPath: null
};

async function testGoogleSheetsConnection() {
  console.log('🧪 Testing Google Sheets connection...');
  
  try {
    const result = await sheetsService.testConnection();
    
    if (result.success) {
      console.log('✅ Google Sheets connection successful!');
      console.log(`📊 Sheet: ${result.sheetTitle}`);
      console.log(`🆔 Sheet ID: ${result.sheetId}`);
      console.log(`📏 Dimensions: ${result.rowCount} rows × ${result.columnCount} columns`);
      return true;
    } else {
      console.error('❌ Google Sheets connection failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection test error:', error.message);
    return false;
  }
}

async function testAppendRegistration() {
  console.log('\n🧪 Testing registration append...');
  
  try {
    const result = await sheetsService.addRegistration(sampleRegistration);
    
    if (result.success) {
      console.log('✅ Registration appended successfully!');
      console.log(`📍 Row number: ${result.rowNumber}`);
      console.log(`🔄 Attempts: ${result.attempt}`);
      return result;
    } else {
      console.error('❌ Failed to append registration:', result.error);
      console.error(`🔄 Total attempts: ${result.attempts}`);
      return result;
    }
  } catch (error) {
    console.error('❌ Append test error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testWithDatabase() {
  console.log('\n🧪 Testing with database integration...');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create a test registration in database
    const registration = new GameRegistration(sampleRegistration);
    await registration.save();
    console.log('✅ Test registration saved to database');
    console.log(`🆔 Registration ID: ${registration.registrationId}`);
    
    // Test sheet sync
    const sheetResult = await sheetsService.addRegistration(registration);
    
    // Update registration with sync status
    registration.sheetSync = {
      success: sheetResult.success,
      error: sheetResult.success ? null : sheetResult.error,
      lastAttempt: new Date(),
      rowNumber: sheetResult.rowNumber || null
    };
    
    await registration.save();
    console.log('✅ Registration updated with sync status');
    
    if (sheetResult.success) {
      console.log('✅ Database + Sheets integration working!');
      console.log(`📍 Sheet row: ${sheetResult.rowNumber}`);
    } else {
      console.error('❌ Sheet sync failed:', sheetResult.error);
    }
    
    // Clean up - remove test registration
    await GameRegistration.deleteOne({ _id: registration._id });
    console.log('🧹 Test registration cleaned up');
    
    return sheetResult;
    
  } catch (error) {
    console.error('❌ Database test error:', error.message);
    return { success: false, error: error.message };
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

async function generateCurlExamples() {
  console.log('\n📋 cURL Examples for Testing:');
  console.log('=' .repeat(50));
  
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3002';
  
  console.log('\n1. Test Registration (replace with actual auth token):');
  console.log(`curl -X POST "${baseUrl}/api/game-registrations/register" \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \\`);
  console.log(`  -d '{
    "gameId": "algo-cricket",
    "gameName": "Algo Cricket",
    "registrationType": "team",
    "teamName": "Test Warriors",
    "teamLeader": {
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "enrollmentNumber": "TEST001",
      "contactNumber": "+91-9876543210",
      "collegeName": "Saffrony Institute of Technology",
      "semester": "5",
      "branch": "Computer Engineering",
      "gender": "Male",
      "degree": "B.Tech"
    },
    "teamMembers": [
      {
        "fullName": "Jane Smith",
        "email": "jane.smith@example.com",
        "enrollmentNumber": "TEST002",
        "contactNumber": "+91-9876543211",
        "collegeName": "Saffrony Institute of Technology",
        "semester": "5",
        "branch": "Computer Engineering",
        "gender": "Female",
        "degree": "B.Tech"
      }
    ],
    "gameDay": "Day 1",
    "specialRequirements": "Need projector for presentation",
    "totalFee": 500
  }'`);
  
  console.log('\n2. Admin Retry Sheet Sync (replace with actual admin token and registration ID):');
  console.log(`curl -X POST "${baseUrl}/api/admin/sheet/retry/REGISTRATION_ID_HERE" \\`);
  console.log(`  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"`);
  
  console.log('\n3. Check Registration Status:');
  console.log(`curl -X GET "${baseUrl}/api/game-registrations" \\`);
  console.log(`  -H "Authorization: Bearer YOUR_AUTH_TOKEN"`);
}

async function runAllTests() {
  console.log('🚀 Starting Google Sheets Integration Tests');
  console.log('=' .repeat(50));
  
  // Check environment variables
  if (!process.env.GOOGLE_SHEETS_ID) {
    console.error('❌ GOOGLE_SHEETS_ID environment variable not set');
    return;
  }
  
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.error('❌ GOOGLE_SERVICE_ACCOUNT_JSON environment variable not set');
    return;
  }
  
  console.log('✅ Environment variables configured');
  
  // Test 1: Connection
  const connectionSuccess = await testGoogleSheetsConnection();
  if (!connectionSuccess) {
    console.error('❌ Stopping tests - connection failed');
    return;
  }
  
  // Test 2: Append without database
  await testAppendRegistration();
  
  // Test 3: Full integration with database
  if (process.env.MONGODB_URI) {
    await testWithDatabase();
  } else {
    console.log('⚠️ Skipping database test - MONGODB_URI not set');
  }
  
  // Generate examples
  generateCurlExamples();
  
  console.log('\n🎉 Tests completed!');
  console.log('=' .repeat(50));
  console.log('Next steps:');
  console.log('1. Check your Google Sheet for test data');
  console.log('2. Try the cURL examples above');
  console.log('3. Test a real registration from your frontend');
  console.log('4. Monitor server logs for sync status');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testGoogleSheetsConnection,
  testAppendRegistration,
  testWithDatabase,
  runAllTests
};
