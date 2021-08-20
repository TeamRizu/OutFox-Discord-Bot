// Libs
const { GoogleSpreadsheet } = require('google-spreadsheet')

exports.LanguageSheetInstance = class {
    constructor() {
        this.doc = new GoogleSpreadsheet(process.env.SHEET_ID)
        this.guildLanguages = null
        this.userLanguages = null
        this.discordgithub = null
    }

    async init() {
        await this.doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_APP_KEY,
        })
        await this.doc.loadInfo()
        this.guildLanguages = this.doc.sheetsByTitle['guild_languages']
        this.userLanguages = this.doc.sheetsByTitle['user_languages']
        this.discordgithub = this.doc.sheetsByTitle['discordgithub']
    }
}
