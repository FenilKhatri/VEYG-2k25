const express = require('express');
const app = express();
const PORT = 3002;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./secret-key.json')
const { success } = require('zod');
const { id } = require('zod/v4/locales');

app.get("/google-sheet", async (req, res) => {
      try {
            const doc = new GoogleSpreadsheet('1BQmS5Fr8NJlDcf96OGIPWuP5da2wDhD2gMwawQR19qA');

            await doc.useServiceAccountAuth(creds);
            await doc.loadInfo();
            console.log('📊 Connected to sheet:', doc.title);

            const sheet = doc.sheetsByIndex[0];
            console.log('📋 Sheet title:', sheet.title);

            // Clear existing data and set headers
            await sheet.clear();
            
            const HEADERS = ['Id', 'Name', 'Email'];
            await sheet.setHeaderRow(HEADERS);
            console.log('✅ Headers set:', HEADERS);

            let dataArray = [
                  { 'Id': 1, 'Name': 'Code Test', 'Email': 'test@gmail.com' },
                  { 'Id': 2, 'Name': 'Demo', 'Email': 'demo@gmail.com' },
            ];
            
            const addedRows = await sheet.addRows(dataArray);
            console.log('✅ Added rows:', addedRows.length);

            let result = {
                  success: 'ok',
                  message: `Successfully added ${addedRows.length} rows to Google Sheet`,
                  sheetTitle: sheet.title,
                  data: dataArray
            }
            res.status(200).json(result);
      } catch (error) {
            console.error('❌ Google Sheets error:', error);
            res.status(500).json({
                  success: false,
                  error: error.message
            });
      }
})

app.listen(PORT, () => {
      console.log(`App is listening at http://localhost:${PORT}`);
})