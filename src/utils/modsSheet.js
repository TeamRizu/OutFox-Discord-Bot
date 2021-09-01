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
            console.warn(
                'Class has not been initialized, please run init() first.'
            )
            return null
        }

        const askForRows = [
            this.convertedMods,
            this.requestsMods,
            this.impossibleMods,
            this.forbiddenMods,
        ]
        const tableName = ['converted', 'requested', 'impossible', 'forbidden']
        const askForProperties = {
            converted: {
                placeAs: ['name', 'pack', 'author', 'version', 'video'],
                getAs: ['File Name', 'Pack', 'Author', 'SM Version', 'YT-Link'],
            },
            requested: {
                placeAs: [
                    'name',
                    'pack',
                    'author',
                    'video',
                    'requestedBy',
                    'status',
                ],
                getAs: [
                    'File Name',
                    'Pack',
                    'Author',
                    'URL of original video/pack release',
                    'Requested by',
                    'Status',
                ],
            },
            impossible: {
                placeAs: [
                    'name',
                    'author',
                    'video',
                    'pack',
                    'requestedBy',
                    'status',
                ],
                getAs: [
                    'File Name',
                    'Author',
                    'URL of original video/pack release',
                    'Pack',
                    'Requested by',
                    'Status / Things Needed',
                ],
            },
            forbidden: {
                placeAs: ['name', 'author', 'video', 'pack', 'type', 'reason'], // The 'Reason' field is not being returned for some reason.
                getAs: [
                    'File Name',
                    'Author',
                    'URL of original video/pack release',
                    'Type',
                    'Reason',
                ],
            },
        }

        for (let i = 0; i < askForRows.length; i++) {
            const row = await askForRows[i].getRows()
            const fileFound = row.find(
                (file) =>
                    file['File Name']?.toLowerCase() === name.toLowerCase() ||
                    file['File Name']
                        ?.toLowerCase()
                        .includes(name.toLowerCase())
            )

            if (!fileFound) continue
            const objToReturn = {}
            for (
                let j = 0;
                j < askForProperties[tableName[i]].placeAs.length;
                j++
            ) {
                objToReturn[askForProperties[tableName[i]].placeAs[j]] =
                    fileFound[askForProperties[tableName[i]].getAs[j]]
            }
            objToReturn.foundIn = tableName[i]
            return objToReturn
        }

        return null
    }
}
