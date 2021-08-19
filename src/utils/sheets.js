const { GoogleSpreadsheet } = require('google-spreadsheet')

exports.SheetInstance = class {
    constructor (sheetID) {
        this.doc = new GoogleSpreadsheet(sheetID)
    }

    async initAuth() {
        await this.doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_APP_KEY,
        })
    }
}
