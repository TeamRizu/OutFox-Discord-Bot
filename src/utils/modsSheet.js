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
                placeAs: ['name', 'author', 'video', 'pack', 'type', 'reason'],
                getAs: [
                    'File Name',
                    'Author',
                    'URL of original video/pack release',
                    'Pack',
                    'Type',
                    'Reason',
                ],
            },
        }

        let fileFound
        let foundIn
        let tableFound
        for (let i = 0; i < askForRows.length; i++) {
            const row = await askForRows[i].getRows()
            row.find(
                (file) => {
                    if (file['File Name']?.toLowerCase() === name.toLowerCase()) {
                        foundIn = 'exact'
                        tableFound = i
                        fileFound = file
                    }

                    if (file['File Name']?.toLowerCase().includes(name.toLowerCase())) {
                        foundIn = 'include'
                        tableFound = i
                        fileFound = file
                    }
                }
            )

            if (foundIn === 'exact') i = askForRows.length
        }

        if (!fileFound) return null

        const objToReturn = {}
        for (
            let j = 0;
            j < askForProperties[tableName[tableFound]].placeAs.length;
            j++
        ) {
            objToReturn[askForProperties[tableName[tableFound]].placeAs[j]] =
                fileFound[askForProperties[tableName[tableFound]].getAs[j]]
        }
        objToReturn.foundIn = tableName[tableFound]
        console.table(objToReturn)
        return objToReturn
    }
}
