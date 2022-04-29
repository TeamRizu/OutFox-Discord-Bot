const fs = require('fs')
const path = require('path')

exports.HashBuildFile = class HashBuildClass = {
  constructor() {
    this.mainObject = JSON.parse( fs.readFileSync(path.join(__dirname, '../data/hash.json')) );
  }

  buildByHash(hash) {
    if (!Object.keys(this.mainObject).includes(hash)) {
      return null
    }

    return this.mainObject[hash]
  }
}