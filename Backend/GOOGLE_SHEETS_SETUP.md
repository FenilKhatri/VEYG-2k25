# Google Sheets Integration Setup Guide

This guide explains how to set up Google Sheets integration for live registration data sync in the VEYG-2025 project.

## Overview

The system automatically appends registration data to a Google Sheet whenever a student/team registers. This provides real-time visibility into registrations without breaking the existing PDF/email flow.

## Features

- ✅ **Live Sync**: Registration data is automatically appended to Google Sheet
- ✅ **Retry Logic**: 3 attempts with exponential backoff for failed syncs
- ✅ **Error Tracking**: Failed syncs are logged in the database
- ✅ **Admin Retry**: Manual retry endpoint for failed syncs
- ✅ **Non-blocking**: Sheet sync failures don't break registration flow

## Sheet Structure

The following columns are automatically created and populated:

| Column | Description | Example |
|--------|-------------|---------|
| Timestamp | Registration sync time | 2025-01-07T00:04:59.000Z |
| RegistrationID | Unique registration ID | VEYG25-SAF-AC-001 |
| GameName | Name of the game | Algo Cricket |
| GameDate | Game day | Day 1 |
| Venue | Event venue | VEYG 2025 Venue |
| TeamLeaderName | Team leader full name | John Doe |
| TeamLeaderEmail | Team leader email | john@example.com |
| TeamLeaderPhone | Team leader contact | +91-9876543210 |
| TeamLeaderCollege | Team leader college | Saffrony Institute |
| TeamMembers | Comma-separated members | Jane Doe <jane@example.com>, Bob Smith <bob@example.com> |
| TotalFee | Registration fee | 500 |
| PaymentStatus | Payment status | pending |
| Notes | Special requirements | Dietary restrictions |

## Setup Instructions

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in service account details:
   - **Name**: `veyg-sheets-service`
   - **Description**: `Service account for VEYG registration sheets`
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"

### Step 3: Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" format
5. Download the JSON file
6. **Important**: Keep this file secure and never commit it to version control

### Step 4: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it: "VEYG 2025 Registrations"
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```

### Step 5: Share Sheet with Service Account

1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (from the JSON file):
   ```
   your-service-account@your-project.iam.gserviceaccount.com
   ```
4. Give "Editor" permissions
5. Click "Send"

### Step 6: Configure Environment Variables

Add these variables to your `.env` file:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

**Option 1: Inline JSON (Recommended for deployment)**
```env
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"}
```

**Option 2: File Path (For local development)**
```env
GOOGLE_SERVICE_ACCOUNT_JSON=./path/to/service-account-key.json
```

### Step 7: Install Dependencies

```bash
npm install google-spreadsheet google-auth-library
```

### Step 8: Test the Integration

1. Start your backend server:
   ```bash
   npm start
   ```

2. Check the logs for successful initialization:
   ```
   ✅ Google Sheets initialized: VEYG 2025 Registrations
   ✅ Header row created in Google Sheet
   ```

3. Test with a registration to see data appear in the sheet

## API Endpoints

### Admin Retry Endpoint

If a registration fails to sync to Google Sheets, admins can manually retry:

```http
POST /api/admin/sheet/retry/:registrationId
Authorization: Bearer <admin_token>
```

**Example:**
```bash
curl -X POST "http://localhost:3002/api/admin/sheet/retry/VEYG25-SAF-AC-001" \
  -H "Authorization: Bearer your_admin_token"
```

**Success Response:**
```json
{
  "success": true,
  "message": "Registration synced to Google Sheet successfully",
  "data": {
    "registrationId": "VEYG25-SAF-AC-001",
    "rowNumber": 15,
    "syncedAt": "2025-01-07T00:04:59.000Z"
  }
}
```

## Troubleshooting

### Common Issues

1. **"Failed to initialize Google Sheets"**
   - Check if `GOOGLE_SHEETS_ID` is correct
   - Verify service account JSON is valid
   - Ensure Google Sheets API is enabled

2. **"Permission denied"**
   - Make sure the sheet is shared with service account email
   - Verify service account has "Editor" permissions

3. **"Sheet headers do not match"**
   - Delete the first row and let the system recreate headers
   - Or manually add the correct headers as shown in the table above

4. **"Authentication failed"**
   - Check if service account key is valid
   - Ensure private key format is correct (with \n for line breaks)

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

This will show detailed Google Sheets API logs in the console.

## Security Best Practices

1. **Never commit service account keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate service account keys** periodically
4. **Limit sheet permissions** to only what's needed
5. **Monitor API usage** in Google Cloud Console

## Monitoring

The system tracks sync status in the database:

```javascript
// Check sync status for a registration
const registration = await GameRegistration.findOne({ registrationId });
console.log(registration.sheetSync);
// Output:
// {
//   success: true,
//   error: null,
//   lastAttempt: 2025-01-07T00:04:59.000Z,
//   rowNumber: 15
// }
```

Failed syncs can be identified and retried using the admin endpoint.

## Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the Google Sheets API connection manually
4. Use the admin retry endpoint for failed syncs

For additional help, refer to the [Google Sheets API documentation](https://developers.google.com/sheets/api).
