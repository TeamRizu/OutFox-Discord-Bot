
// eslint-disable-next-line no-unused-vars
const { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } = require('google-spreadsheet')
const googleSecrets = require('../../google-secrets.json')
exports.ModsSheetClass = class {
  constructor () {
    this.sheet = null
    this.convertedMods = null
    this.requestedMods = null
    this.impossibleMods = null
    this.packMods = null
    this.forbiddenMods = null
    this.sheetLoaded = false
  }

  async loadSpreadSheet () {
    this.sheet = new GoogleSpreadsheet(process.env.MODS_ID)

    await this.sheet.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: googleSecrets['private-key'].replace(/\\n/g, '\n')
    })

    await this.sheet.loadInfo()

    this.convertedMods = this.sheet.sheetsByTitle['Converted to SM5 & OutFox']
    // this.requestedMods = this.sheet.sheetsByTitle['Single Release Surplus'] TODO: This particupar sheer has been modified in a way that would need a bit more work to support than I'm willing right now.
    // this.impossibleMods = this.sheet.sheetsByTitle['Impossible Requests'] TODO: Same as above, not even sure which sheet this would apply to now.
    // this.packMods = this.sheet.sheetsByTitle['Whole Pack Madness'] TODO: Same as above.
    // this.forbiddenMods = this.sheet.sheetsByTitle.Forbidden // This seems to be working...for now.

    this.sheetLoaded = true
    return this.sheet
  }

  async chartByName (name) {
    if (!this.sheetLoaded) {
      console.warn('Failed attempt of calling chartByName, call loadSpreadSheet first.')
      return null
    }

    const objectsToSearch = [this.convertedMods.getRows()/*, this.requestedMods.getRows(), this.impossibleMods.getRows, this.forbiddenMods.getRows() */]
    const chartPossibleStatus = ['converted'/*, 'requested', 'impossible', 'forbidden' */]
    let chartFound = null
    let chartStatus = 'unknown'

    for (let i = 0; i < objectsToSearch.length; i++) {
      const currentRow = objectsToSearch[i]
      const exactSearch = currentRow.find((chart) => chart['File Name']?.toLowerCase() === name.toLowerCase())

      if (exactSearch) {
        chartFound = exactSearch
        chartStatus = chartPossibleStatus[i]
        i = objectsToSearch.length
      }
    }

    if (chartFound === null) {
      for (let i = 0; i < objectsToSearch.length; i++) {
        const currentRow = objectsToSearch[i]
        const includeSearch = currentRow.find((chart) => chart['File Name']?.toLowerCase().includes(name.toLowerCase()))

        if (includeSearch) {
          chartFound = includeSearch
          chartStatus = chartPossibleStatus[i]
          i = objectsToSearch.length
        }
      }
    }

    return {
      chart: chartFound,
      status: chartStatus
    }
  }

  async charts () {
    if (!this.sheetLoaded) {
      console.warn('Failed attempt of getting charts, call loadSpreadSheet first.')
      return null
    }

    const objectsToSearch = [await this.convertedMods.getRows()/*, await this.requestedMods.getRows(), await this.impossibleMods.getRows(), this.forbiddenMods.getRows() */]
    const chartPossibleStatus = ['converted', /*'requested', 'impossible', 'forbidden' */]
    const charts = {
      converted: []
      /*requested: [],
      impossible: []
      forbidden: []*/
    }

    for (let i = 0; i < objectsToSearch.length; i++) {
      const currentRow = objectsToSearch[i]
      const modfileStatus = chartPossibleStatus[i]

      currentRow.forEach((modfile) => {
        if (modfileStatus === 'converted') {
          if (!modfile['File Name']) return
          if (!modfile['SM Version']) return
          if (!modfile['YT-Link']) return // This requirement might be removed in the future or changed.

          charts.converted.push({
            name: modfile['File Name'],
            support: modfile['SM Version'],
            video: modfile['YT-Link'],
            author: modfile.Author || null,
            pack: modfile.Pack || null,
            problems: modfile['Fix-up Status'] || null
          })
        }

        if (modfileStatus === 'requested') {
          if (!modfile['File Name']) return

          charts.requested.push({
            name: modfile['File Name'],
            author: modfile.Author || null,
            video: modfile['URL of original video/pack release'] || null,
            pack: modfile.Pack || null,
            requestOf: modfile['Requested by'] || null
          })
        }

        if (modfileStatus === 'impossible') {
          if (!modfile['File Name']) return
          if (!modfile.Author) return

          charts.impossible.push({
            name: modfile['File Name'],
            author: modfile.Author,
            video: modfile['URL of original video/pack release'] || null,
            pack: modfile.Pack || null,
            requestOf: modfile['Requested by'] || null,
            problems: modfile['Status / Things Needed'] || null
          })
        }
      })
    }

    return charts
  }
}
