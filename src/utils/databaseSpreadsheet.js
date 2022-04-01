const { GoogleSpreadsheet } = require('google-spreadsheet')
exports.DatabaseFile = class DatabaseSpreadsheetInstance {
	constructor(SHEET_ID) {
		this.doc = new GoogleSpreadsheet(SHEET_ID)
	}

	async initDocument() {
		await this.doc.useServiceAccountAuth({
        	client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        	private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    	})
    	await this.doc.loadInfo()

    	return this.doc
	}
}