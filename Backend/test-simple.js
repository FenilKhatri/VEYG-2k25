require('dotenv').config();

const sheetsService = require('./services/googleSheets');

async function testConnection() {
    console.log('🧪 Testing Google Sheets connection...');
    
    try {
        const result = await sheetsService.testConnection();
        
        if (result.success) {
            console.log('✅ Connection successful!');
            console.log('Sheet title:', result.sheetTitle);
            console.log('Sheet ID:', result.sheetId);
            console.log('Rows:', result.rowCount);
            console.log('Columns:', result.columnCount);
        } else {
            console.error('❌ Connection failed:', result.error);
        }
        
        return result.success;
    } catch (error) {
        console.error('❌ Test error:', error.message);
        return false;
    }
}

async function testAddData() {
    console.log('\n🧪 Testing data addition...');
    
    const sampleData = {
        registrationId: 'TEST-' + Date.now(),
        gameName: 'Test Game',
        gameDay: 'Day 1',
        teamLeader: {
            fullName: 'John Doe',
            email: 'john@test.com',
            contactNumber: '+91-9876543210',
            collegeName: 'Test College'
        },
        teamMembers: [
            {
                fullName: 'Jane Smith',
                email: 'jane@test.com'
            }
        ],
        totalFee: 500,
        paymentStatus: 'pending',
        specialRequirements: 'Test requirements'
    };
    
    try {
        const result = await sheetsService.addRegistration(sampleData);
        
        if (result.success) {
            console.log('✅ Data added successfully!');
            console.log('Row number:', result.rowNumber);
        } else {
            console.error('❌ Failed to add data:', result.error);
        }
        
        return result.success;
    } catch (error) {
        console.error('❌ Add data error:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Starting Google Sheets Tests');
    console.log('================================');
    
    // Test connection
    const connectionSuccess = await testConnection();
    
    if (connectionSuccess) {
        // Test data addition
        await testAddData();
    }
    
    console.log('\n🎉 Tests completed!');
}

runTests().catch(console.error);
