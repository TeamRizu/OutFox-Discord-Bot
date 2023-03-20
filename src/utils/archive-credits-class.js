const axios = require('axios')

exports.ArchiveAnnouncersClass = class ArchiveAnnouncersClass {
  constructor () {
    /**
     * @type {string}
     */
    this.sourceURL =
      'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Builds/Credits/data.json'
    this.mainObject = null
  }

  async setup () {
    const body = await axios.get(this.sourceURL)

    this.mainObject = body.data
  }

  /**
  * @returns {Array<string>}
  */
  get engines () {
    return Object.keys(this.mainObject).filter((e) => e !== 'Mung3')
  }

  /**
  *
  * @param {string} engine
  * @returns {string[]}
  */
  creditsTitleByEngine (engine) {
    if (!this.engines.includes(engine)) {
      return []
    }

    const credits = this.mainObject[engine]
    const finalArr = []

    for (let i = 0; i < credits.length; i++) {
      finalArr.push(credits[i].title)
    }

    return finalArr
  }
}
