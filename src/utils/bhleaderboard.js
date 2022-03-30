const { GoogleSpreadsheet } = require('google-spreadsheet')
exports.LeaderboardFile = class LeaderboardSheetInstance {
  constructor() {
    this.doc = new GoogleSpreadsheet(process.env.SHEET_ID)
    this.users = null
    this.points = null
    this.issues = null
    this.classifications = null
    this.bhl = null
    this.pages = null
    this.pageCharLimit = 1024
    this.pagesChars = []
  }

  async init() {
    await this.doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    })
    await this.doc.loadInfo()
    this.bhl = this.doc.sheetsByTitle['bhl']
    const rows = await this.bhl.getRows()
    this.users = []
    this.points = []
    this.issues = []
    this.classifications = []
    this.pages = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      this.users.push(row.user)
      this.points.push(row.points)
      this.issues.push(row.last_issue)
      this.classifications.push(row.classification)

      const currentPageIndex = this.pages.length >= 1 ? this.pages.length - 1 : 0

      if (!this.pages[currentPageIndex]) {
        this.pages[currentPageIndex] = {
          users: []
        }
      }

      this.pages[currentPageIndex].users.push(row.user)
      const currentPageLength = (await this.buildPage(currentPageIndex)).length

      if (currentPageLength >= this.pageCharLimit) {
        this.pages[currentPageIndex + 1] = {
          users: []
        }
      }
    }

    return this.doc
  }

  async buildPage(pageIndex = 0) {
    if (!this.users) {
      await this.init()
    }

    const page = this.pages[pageIndex]
    const users = page.users

    let finalStr = ''

    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const userIndex = this.users.indexOf(user)
      const point = this.points[userIndex]
      const classification = this.classifications[userIndex]

      finalStr = finalStr + `${point} Points - ${user} (${classification})\n`
    }

    return finalStr
  }

  async usersFromPage(pageIndex = 0) {
    if (!this.users) {
      await this.init()
    }
    return this.pages[pageIndex].users
  }

}
