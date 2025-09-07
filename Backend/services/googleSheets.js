const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

class GoogleSheetsService {
    constructor() {
        this.doc = null;
        this.auth = null;
        this.initialized = false;
        
        // Column headers for the sheet
        this.headers = [
            'Timestamp',
            'RegistrationID', 
            'GameName',
            'GameDate',
            'Venue',
            'TeamLeaderName',
            'TeamLeaderEmail',
            'TeamLeaderPhone',
            'TeamLeaderCollege',
            'TeamMembers',
            'TotalFee',
            'PaymentStatus',
            'Notes'
        ];
    }

    async init() {
        try {
            console.log('🔄 Initializing Google Sheets service...');
            
            const sheetsId = process.env.GOOGLE_SHEETS_ID;
            const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
            
            if (!sheetsId) {
                throw new Error('GOOGLE_SHEETS_ID not found in environment variables');
            }
            
            if (!serviceAccountJson) {
                throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not found in environment variables');
            }

            // Parse service account credentials
            let credentials;
            try {
                credentials = JSON.parse(serviceAccountJson);
            } catch (parseError) {
                throw new Error('Invalid JSON in GOOGLE_SERVICE_ACCOUNT_JSON');
            }

            // Create JWT auth
            this.auth = new JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            // Initialize document
            this.doc = new GoogleSpreadsheet(sheetsId, this.auth);
            await this.doc.loadInfo();
            
            console.log('✅ Google Sheets connected:', this.doc.title);
            
            // Setup headers
            await this.setupHeaders();
            
            this.initialized = true;
            return true;
            
        } catch (error) {
            console.error('❌ Google Sheets initialization failed:', error.message);
            this.initialized = false;
            return false;
        }
    }

    async setupHeaders() {
        try {
            const sheet = this.doc.sheetsByIndex[0];
            
            // Check if headers already exist
            const rows = await sheet.getRows({ limit: 1 });
            
            if (rows.length === 0) {
                // No data, add headers
                await sheet.setHeaderRow(this.headers);
                console.log('✅ Headers added to Google Sheet');
            } else {
                console.log('✅ Headers already exist in Google Sheet');
            }
            
        } catch (error) {
            console.error('❌ Failed to setup headers:', error.message);
            throw error;
        }
    }

    formatRegistrationData(registration) {
        // Format team members as comma-separated string
        let teamMembersStr = '';
        if (registration.teamMembers && registration.teamMembers.length > 0) {
            teamMembersStr = registration.teamMembers
                .map(member => `${member.fullName || 'Unknown'} <${member.email || 'no-email'}>`)
                .join(', ');
        }

        return {
            'Timestamp': new Date().toISOString(),
            'RegistrationID': registration.registrationId || registration._id?.toString() || '',
            'GameName': registration.gameName || '',
            'GameDate': registration.gameDay || '',
            'Venue': 'VEYG 2025',
            'TeamLeaderName': registration.teamLeader?.fullName || '',
            'TeamLeaderEmail': registration.teamLeader?.email || '',
            'TeamLeaderPhone': registration.teamLeader?.contactNumber || '',
            'TeamLeaderCollege': registration.teamLeader?.collegeName || '',
            'TeamMembers': teamMembersStr,
            'TotalFee': registration.totalFee || 0,
            'PaymentStatus': registration.paymentStatus || 'pending',
            'Notes': registration.specialRequirements || ''
        };
    }

    async addRegistration(registration, retryCount = 0) {
        const maxRetries = 3;
        const baseDelay = 1000;

        try {
            // Initialize if not done
            if (!this.initialized) {
                const initSuccess = await this.init();
                if (!initSuccess) {
                    throw new Error('Failed to initialize Google Sheets service');
                }
            }

            console.log(`📊 Adding registration to Google Sheet (attempt ${retryCount + 1}/${maxRetries})`);
            
            const sheet = this.doc.sheetsByIndex[0];
            const rowData = this.formatRegistrationData(registration);
            
            console.log('📋 Data to add:', JSON.stringify(rowData, null, 2));
            
            const addedRow = await sheet.addRow(rowData);
            
            console.log('✅ Registration added to Google Sheet successfully');
            console.log('📍 Row number:', addedRow.rowNumber);
            
            return {
                success: true,
                rowNumber: addedRow.rowNumber,
                attempt: retryCount + 1
            };

        } catch (error) {
            console.error(`❌ Failed to add registration (attempt ${retryCount + 1}):`, error.message);
            
            if (retryCount < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, retryCount);
                console.log(`⏳ Retrying in ${delay}ms...`);
                
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.addRegistration(registration, retryCount + 1);
            } else {
                console.error('❌ All retry attempts failed');
                return {
                    success: false,
                    error: error.message,
                    attempts: maxRetries
                };
            }
        }
    }

    async testConnection() {
        try {
            const initSuccess = await this.init();
            if (!initSuccess) {
                return { success: false, error: 'Failed to initialize' };
            }

            const sheet = this.doc.sheetsByIndex[0];
            
            return {
                success: true,
                sheetTitle: sheet.title,
                sheetId: this.doc.spreadsheetId,
                rowCount: sheet.rowCount,
                columnCount: sheet.columnCount
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export singleton instance
module.exports = new GoogleSheetsService();
