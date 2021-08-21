// Libs
const { GoogleSpreadsheet } = require('google-spreadsheet')

exports.ModsSheetInstance = class {
    constructor() {
        this.doc = new GoogleSpreadsheet(process.env.MODS_ID)
        this.convertedMods = null
        this.requestsMods = null
        this.impossibleMods = null
        this.packMods = null
        this.forbiddenMods = null
    }

    async init() {
        await this.doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_APP_KEY,
        })
        await this.doc.loadInfo()
        this.convertedMods = this.doc.sheetsByTitle['Converted to SM5']
        this.requestsMods = this.doc.sheetsByTitle['Requests']
        this.impossibleMods = this.doc.sheetsByTitle['Impossible Requests']
        this.packMods = this.doc.sheetsByTitle['Whole Pack Requests :(']
        this.forbiddenMods = this.doc.sheetsByTitle['Forbidden']
    }
}
