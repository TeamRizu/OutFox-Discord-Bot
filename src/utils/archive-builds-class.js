const axios = require('axios')

exports.ArchiveAnnouncersClass = class ArchiveAnnouncersClass {
  constructor () {
    /**
     * @type {string}
     */
    this.sourceURL =
      'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Builds/BuildListing.json'
    this.mainObject = null
  }

  async setup () {
    const body = await axios.get(this.sourceURL)

    this.mainObject = body.data
  }

  /**
   * @returns {Array<string>}
   */
  get buildListIDs () {
    return Object.keys(this.mainObject)
  }

  /**
   * @returns {Array<string>}
   */
  get buildListName () {
    const finalArr = []

    for (let i = 0; i < this.buildListIDs.length; i++) {
      finalArr.push(this.mainObject[this.buildListIDs[i]].Name)
    }

    return finalArr
  }

  /**
   *
   * @param {string} buildListID
   */
  buildListObjectFromID (buildListID) {
    return this.mainObject[buildListID]
  }

  /**
   *
   * @param {string} buildListID
   * @returns {string[]}
   */
  listingNamesFromID (buildListID) {
    const engine = this.buildListObjectFromID(buildListID)
    const finalArr = []

    for (let i = 0; i < engine.Listing.length; i++) {
      finalArr.push(engine.Listing[i].Name)
    }

    return finalArr
  }
}
