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

    async getGoogleSheets() {
        const { auth, googleSheets } = await this.authGoogleSheets();
        // Get spreadSheet titles
        const data = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        });
        return data.data.sheets;
    }

    async getGoogleSheetsRows(sheetName) {
        const { auth, googleSheets } = await this.authGoogleSheets();
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
            range: sheetName,
        });
        return getRows.data.values;
    }

    async parseSheet(sheetName) {
        // get rows of certain sheet for parsing
        let sheet = await this.getGoogleSheetsRows(sheetName);

        // clear extra rows that we don't need to parse
        for (let index = 0; index < sheet.length; index++) {
            if (sheet[index][0] === "Імя ") {
                sheet.splice(0, index);
            }
        }
        let parsedSheet = new Array();
        // width loop
        let tempArr;
        for (let i = 1; i < sheet[0].length; i++) {
            tempArr = new Map();
            // height loop
            for (let j = 0; j < sheet.length; j++) {
                if (sheet[j][i] != undefined && sheet[j][i] !== "") {
                    tempArr.set(sheet[j][0], sheet[j][i]);
                }
            }
            parsedSheet.push(tempArr);
        }

        return parsedSheet;
    }
}

module.exports = new GoogleSheetsController();
