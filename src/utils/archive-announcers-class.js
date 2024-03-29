const axios = require('axios')

exports.ArchiveAnnouncersClass = class ArchiveAnnouncersClass {
  constructor () {
    /**
     * @type {string}
     */
    this.sourceURL =
      'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Announcers/db.json'
    this.mainObject = null
  }

  async setup () {
    const body = await axios.get(this.sourceURL)

    this.mainObject = body.data
  }

  /**
   * @returns {Array<string>}
   */
  get announcers () {
    return Object.keys(this.mainObject)
  }

  /**
   * @returns {Object<string, Array<string>>}
   */
  get announcersFromAuthors () {
    const finalObj = {}
    const announcersObj = Object.values(this.mainObject)
    const announcersName = this.announcers

    for (let i = 0; i < announcersObj.length; i++) {
      const author = announcersObj[i].Author || 'Unlisted'

      if (!finalObj[author]) {
        finalObj[author] = []
      }

      finalObj[author].push(announcersName[i])
    }

    return finalObj
  }

  /**
   * Gets all announcers made by given author
   * @param {string} author
   * @returns {Array.<{name: string}>}
   */
  announcersByAuthor (author) {
    if (!this.announcersFromAuthors[author]) {
      return []
    }

    const finalArr = []
    const announcersFromAuthor = this.announcersFromAuthors[author]

    for (let i = 0; i < announcersFromAuthor.length; i++) {
      const announcerName = announcersFromAuthor[i]

      finalArr.push({
        name: announcerName
      })
    }

    return finalArr
  }
}
