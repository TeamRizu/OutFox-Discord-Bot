const { GoogleSpreadsheet } = require('google-spreadsheet')

exports.LanguagestatusFile = class LanguagestatusInstance {
  constructor() {
    /**
     * @type {GoogleSpreadsheet}
     */
    this.doc = global.OutFoxGlobal ? global.OutFoxGlobal.databaseDoc : null
    /**
     * @type {string[]}
     */
    this.versions = null
    /**
     * @type {Array<string[]>}
     */
    this.languages = null
    /**
     * @type {Array<string[]>}
     */
    this.status = null
  }

  /**
   * @async
   * @function
   * @property
   * @returns {Promise<GoogleSpreadsheet>}
   */
  async init() {
    /*
    The case bellow will only happen if src/index.js is not run.
    This is the case when you try to sync up commands using slash-up.
    */
    if (!this.doc) {
      this.doc = new GoogleSpreadsheet(process.env.SHEET_ID)
      await this.doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      })
      await this.doc.loadInfo()
    }

    this.bhl = this.doc.sheetsByTitle['languagestatus']
    const rows = await this.bhl.getRows()
    this.versions = []

    this.languages = [...rows[0]._sheet.headerValues.slice(1)]
    this.status = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      this.versions.push(row.Version)
      this.status.push([...row._rawData.slice(1)])
    }

    return this.doc
  }

  /**
   *
   * @param {import('../types/tsTypes/types').OutFoxLanguages} language
   * @returns {string[]}
   */
  statusFromLanguage(language) {
    const languageIndex = this.languages.indexOf(language)
    const statuses = []

    for (let i = 0; i < this.status.length; i++) {
      statuses.push(this.status[i][languageIndex])
    }

    return statuses
  }

  /**
   *
   * @param {string} version
   * @returns {string[]}
   */
  statusFromVersion(version) {
    const versionIndex = this.versions.indexOf(version)

    return this.status[versionIndex]
  }
}
