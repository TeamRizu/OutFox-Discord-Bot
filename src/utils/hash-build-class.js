const fs = require('fs')
const path = require('path')

exports.HashBuildClass = class HashBuildClass {
  constructor () {
    /**
     * @type {Object<string, object>}
     */
    this.mainObject = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/hash.json'))
    )
  }

  /**
   *
   * @param {string} hash
   * @returns {object}
   */
  buildByHash (hash) {
    if (!Object.keys(this.mainObject).includes(hash)) {
      return null
    }

    return this.mainObject[hash]
  }
}
