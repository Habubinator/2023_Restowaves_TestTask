const { google } = require("googleapis");

class GoogleSheetsController {
    async authGoogleSheets() {
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        // Instance for Auth to google APIs
        const client = await auth.getClient();
        // Instance for Google Sheets API
        const googleSheets = google.sheets({ version: "v4", auth: client });
        return { auth, client, googleSheets };
    }

    async accessGoogleSheets() {
        const { auth, googleSheets } = await this.authGoogleSheets();
        // Get spreadSheet titles
        const data = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        });
        return data.data.sheets;
    }

    async getGoogleSheetsRows(modelName) {
        const { auth, googleSheets } = await this.authGoogleSheets();
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
            range: modelName,
        });
        return getRows.data.values;
    }
}

module.exports = new GoogleSheetsController();
