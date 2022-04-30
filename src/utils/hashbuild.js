const fs = require('fs')
const path = require('path')

exports.HashBuildFile = class HashBuildClass {
  constructor() {
    /**
     * @type {Object<string, import('../types/types').HashBuild>}
     */
    this.mainObject = JSON.parse( fs.readFileSync(path.join(__dirname, '../data/hash.json')) );
  }

  /**
   *
   * @param {string} hash
   * @returns {import('../types/types').HashBuild}
   */
  buildByHash(hash) {
    if (!Object.keys(this.mainObject).includes(hash)) {
      return null
    }

    return this.mainObject[hash]
  }
}
