const fs = require('fs')
const path = require('path')

/**
 * @typedef {Object} TermDecorations
 * @property {string} [image]
 * @property {string} [thumbnail]
 * @property {string} [color]
 */

/**
 * @typedef {Object} TermURLReference
 * @property {'url'} type
 * @property {string} url
 * @property {string} label
 */

/**
 * @typedef {Object} TermReference
 * @property {'term'} type
 * @property {string} term - Must be lowercase.
 * @property {string} [label]
 */

/**
 * @typedef {Object} TermObject
 * @property {string} name - Must be lowercase.
 * @property {string} properName - Will replace the name property, does not need to be lowercase.
 * @property {Array<string>} [aliases] - Must be lowercase.
 * @property {Object<string, string>} [properAlias] - Will replace the alises property, does not need to be lowercase.
 * @property {string} explanation
 * @property {Object<string, string>} [aliasesExplanation] - Keys must be lowercase.
 * @property {TermDecorations} [decorations]
 * @property {Array<TermReference | TermURLReference>} [references] - The array may contain both types, max length of 5.
 */

exports.TermClass = class TermsClass {
  constructor () {
    this.mainObject = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/terms.json')))
    this.termArr = this.mainObject.termArr
  }

  /**
   * @returns {Array<string>}
   */
  get terms () {
    const finalArr = []

    for (let i = 0; i < this.termArr.length; i++) {
      /**
       * @type {TermObject}
       */
      const currentTerm = this.termArr[i]

      finalArr.push(currentTerm.name)

      if (!currentTerm.aliases) continue

      currentTerm.aliases.forEach((e) => {
        finalArr.push(e)
      })
    }

    return finalArr
  }

  /**
   *
   * @param {string} name - The term name, must be lowercase.
   * @returns {TermObject | null}
   */
  termObjectByName (name) {
    if (!this.terms.includes(name)) return null

    for (let i = 0; i < this.termArr.length; i++) {
      /**
       * @type {TermObject}
       */
      const currentTerm = this.termArr[i]

      if (currentTerm.name === name || currentTerm.aliases?.includes(name)) {
        return currentTerm
      }
    }

    return null // Might happen if interacting with old command versions
  }
}
