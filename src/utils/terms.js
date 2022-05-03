const fs = require('fs')
const path = require('path')

exports.TermsFile = class TermsClass {
  constructor() {
    this.mainObject = JSON.parse( fs.readFileSync(path.join(__dirname, '../data/terms.json')) );
    this.termArr = this.mainObject.termArr
  }

  get terms() {
    const finalArr = []

    for (let i = 0; i < this.termArr.length; i++) {
      const currentTerm = this.termArr[i]

      finalArr.push(currentTerm.name)

      if (!currentTerm.aliases) continue

      currentTerm.aliases.forEach((e) => {
        finalArr.push(e)
      })
    }

    return finalArr
  }

  termObjectByName(name) {
    if (!this.terms.includes(name)) return null

    for (let i = 0; i < this.termArr.length; i++) {
      const currentTerm = this.termArr[i]

      if (currentTerm.name === name || currentTerm.aliases?.includes(name)) {
        return currentTerm
      }
    }

    return null // Might happen if interacting with old command versions
  }
}
