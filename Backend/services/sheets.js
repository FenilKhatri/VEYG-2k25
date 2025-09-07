const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

class GoogleSheetsService {
    constructor() {
        this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
        this.serviceAccountAuth = null;
        this.doc = null;
        this.initialized = false;
        
        // Define the columns for registration data
        this.COLUMNS = [
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

    async initialize() {
        if (this.initialized) return;

        try {
            // Parse service account credentials
            let serviceAccountKey;
            if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
                if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON.startsWith('{')) {
                    // JSON string
                    serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
                } else {
                    // File path
                    serviceAccountKey = require(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
                }
            } else {
                throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable not set');
            }

            if (!this.spreadsheetId) {
                throw new Error('GOOGLE_SHEETS_ID environment variable not set');
            }

            // Initialize JWT auth
            this.serviceAccountAuth = new JWT({
                email: serviceAccountKey.client_email,
                key: serviceAccountKey.private_key,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            // Initialize document
            this.doc = new GoogleSpreadsheet(this.spreadsheetId, this.serviceAccountAuth);
            await this.doc.loadInfo();
            
            console.log('✅ Google Sheets initialized:', this.doc.title);
            
            // Ensure header row exists
            await this.ensureHeaderRow();
            
            this.initialized = true;
        } catch (error) {
            console.error('❌ Failed to initialize Google Sheets:', error.message);
            throw error;
        }
    }

    async ensureHeaderRow() {
        try {
            const sheet = this.doc.sheetsByIndex[0];
            
            // Load existing rows to check if header exists
            const rows = await sheet.getRows({ limit: 1 });
            
            if (rows.length === 0) {
                // No rows exist, add header
                await sheet.setHeaderRow(this.COLUMNS);
                console.log('✅ Header row created in Google Sheet');
            } else {
                // Check if existing header matches our columns
                const existingHeaders = Object.keys(rows[0]._rawData);
                const headersMatch = this.COLUMNS.every(col => existingHeaders.includes(col));
                
                if (!headersMatch) {
                    console.warn('⚠️ Sheet headers do not match expected columns. Expected:', this.COLUMNS);
                    console.warn('⚠️ Found:', existingHeaders);
                }
            }
        } catch (error) {
            console.error('❌ Failed to ensure header row:', error.message);
            throw error;
        }
    }

    formatTeamMembers(teamMembers) {
        if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length === 0) {
            return '';
        }
        
        return teamMembers.map(member => 
            `${member.fullName || member.name || 'Unknown'} <${member.email || 'no-email'}>`
        ).join(', ');
    }

    formatRegistrationData(registrationDoc) {
        const teamLeader = registrationDoc.teamLeader || {};
        
        return {
            'Timestamp': new Date().toISOString(),
            'RegistrationID': registrationDoc.registrationId || registrationDoc._id?.toString() || '',
            'GameName': registrationDoc.gameName || '',
            'GameDate': registrationDoc.gameDay || '',
            'Venue': 'VEYG 2025 Venue',
            'TeamLeaderName': teamLeader.fullName || '',
            'TeamLeaderEmail': teamLeader.email || '',
            'TeamLeaderPhone': teamLeader.contactNumber || '',
            'TeamLeaderCollege': teamLeader.collegeName || '',
            'TeamMembers': this.formatTeamMembers(registrationDoc.teamMembers),
            'TotalFee': registrationDoc.totalFee || 0,
            'PaymentStatus': registrationDoc.paymentStatus || 'pending',
            'Notes': registrationDoc.specialRequirements || ''
        };
    }

    async appendRegistrationRow(registrationDoc, attempt = 1) {
        const maxAttempts = 3;
        const baseDelay = 1000; // 1 second

        try {
            // Ensure initialization
            if (!this.initialized) {
                await this.initialize();
            }

            const sheet = this.doc.sheetsByIndex[0];
            const rowData = this.formatRegistrationData(registrationDoc);
            
            console.log(`📊 Attempting to append registration to Google Sheet (attempt ${attempt}/${maxAttempts})`);
            console.log('📋 Row data:', rowData);

            const addedRow = await sheet.addRow(rowData);
            
            console.log('✅ Successfully appended registration to Google Sheet');
            console.log('📍 Row number:', addedRow.rowNumber);
            
            return {
                success: true,
                rowNumber: addedRow.rowNumber,
                attempt: attempt
            };

        } catch (error) {
            console.error(`❌ Failed to append to Google Sheet (attempt ${attempt}/${maxAttempts}):`, error.message);
            
            if (attempt < maxAttempts) {
                // Exponential backoff: wait 1s, 2s, 4s
                const delay = baseDelay * Math.pow(2, attempt - 1);
                console.log(`⏳ Retrying in ${delay}ms...`);
                
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.appendRegistrationRow(registrationDoc, attempt + 1);
            } else {
                // All attempts failed
                console.error('❌ All attempts to append to Google Sheet failed');
                return {
                    success: false,
                    error: error.message,
                    attempts: maxAttempts
                };
            }
        }
    }

    async testConnection() {
        try {
            await this.initialize();
            const sheet = this.doc.sheetsByIndex[0];
            
            return {
                success: true,
                sheetTitle: sheet.title,
                sheetId: this.spreadsheetId,
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