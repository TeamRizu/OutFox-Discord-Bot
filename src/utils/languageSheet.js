const { SheetInstance } = require('./sheets.js')
exports.LanguageSheetInstance = class extends SheetInstance {
    constructor() {
        super(process.env.SHEET_ID)
    }
}
