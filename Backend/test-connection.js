require('dotenv').config();

console.log('Environment variables:');
console.log('GOOGLE_SHEETS_ID:', process.env.GOOGLE_SHEETS_ID);
console.log('GOOGLE_SERVICE_ACCOUNT_JSON:', process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

// Test if service account file exists
const fs = require('fs');
const path = './secret-key.json';

if (fs.existsSync(path)) {
    console.log('✅ Service account file exists');
    try {
        const serviceAccount = JSON.parse(fs.readFileSync(path, 'utf8'));
        console.log('✅ Service account JSON is valid');
        console.log('Service account email:', serviceAccount.client_email);
        console.log('Project ID:', serviceAccount.project_id);
    } catch (error) {
        console.error('❌ Invalid JSON in service account file:', error.message);
    }
} else {
    console.error('❌ Service account file not found at:', path);
}

// Test Google Sheets connection
async function testConnection() {
    try {
        const { GoogleSpreadsheet } = require('google-spreadsheet');
        const { JWT } = require('google-auth-library');
        
        const serviceAccount = JSON.parse(fs.readFileSync('./secret-key.json', 'utf8'));
        
        const serviceAccountAuth = new JWT({
            email: serviceAccount.client_email,
            key: serviceAccount.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, serviceAccountAuth);
        
        console.log('🔄 Attempting to connect to Google Sheets...');
        await doc.loadInfo();
        
        console.log('✅ Successfully connected to Google Sheets!');
        console.log('Sheet title:', doc.title);
        console.log('Sheet count:', doc.sheetCount);
        console.log('First sheet title:', doc.sheetsByIndex[0].title);
        
    } catch (error) {
        console.error('❌ Google Sheets connection failed:', error.message);
        
        if (error.message.includes('permission')) {
            console.log('\n🔧 SOLUTION: Share your Google Sheet with the service account email:');
            console.log('   veyg-2k25@ardent-strategy-471111-u6.iam.gserviceaccount.com');
            console.log('   Give it "Editor" permissions');
        }
    }
}

testConnection();
