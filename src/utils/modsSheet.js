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

    async chartInfo(name) {
        if (!this.convertedMods) {
            console.warn('Class has not been initialized, please run init() first.')
            return null
        }

        const modsRows = await this.convertedMods.getRows()
        let fileFound = modsRows.find(file => file['File Name'].toLowerCase() === name.toLowerCase() || file['File Name'].toLowerCase().includes(name.toLowerCase()))

        if (fileFound) {
            return {
                name: fileFound['File Name'],
                series: fileFound.Series,
                author: fileFound.Author,
                version: fileFound['SM Version'],
                video: fileFound['YT-Link'],
                originalObject: fileFound,
                foundIn: 'converted'
            }
        }

        const requestedRows = await this.requestsMods.getRows()
        fileFound = requestedRows.find(file => file['File name'].toLowerCase() === name.toLowerCase() || file['File Name'].toLowerCase().includes(name.toLowerCase()))

        if (fileFound) {
            return {
                name: fileFound['File name'],
                series: fileFound.Pack,
                author: fileFound.Author,
                // version: fileFound['SM Version'],
                video: fileFound['URL of original video/pack release'],
                requestedBy: fileFound['Requested by'],
                status: fileFound.Status,
                originalObject: fileFound,
                foundIn: 'requested'
            }
        }

        const impossibleRows = await this.impossibleMods.getRows()
        fileFound = impossibleRows.find(file => file['File name'].toLowerCase() === name.toLowerCase() || file['File Name'].toLowerCase().includes(name.toLowerCase()))

        if (fileFound) {
            return {
                name: fileFound['File name'],
                author: fileFound.Author,
                video: fileFound['URL of original video/pack release'],
                series: fileFound.Pack,
                requestedBy: fileFound['Requested by'],
                status: fileFound['Status / Things Needed'],
                originalObject: fileFound,
                foundIn: 'impossible'
            }
        }

        // TODO: Whole pack requests search, I have no idea how I'm gonna support that.

        const forbiddenRows = await this.forbiddenMods.getRows()
        fileFound = forbiddenRows.find(file => file['File name'].toLowerCase() === name.toLowerCase() || file['File Name'].toLowerCase().includes(name.toLowerCase()))

        if (fileFound) {
            return {
                name: fileFound['File name'],
                author: fileFound.Author,
                video: fileFound['URL of original video/pack release'],
                series: fileFound.Pack,
                type: fileFound.Type,
                reason: fileFound.Reason,
                originalObject: fileFound,
                foundIn: 'forbidden'
            }
        }

        return null
    }
}
