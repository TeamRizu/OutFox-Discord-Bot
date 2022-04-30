const fs = require('fs')
const path = require('path')

exports.WikiPreferencesFile = class WikiPreferencesInstance {
  constructor() {
    /**
     * @type {Object<string, string>}
     */
    this.mainObject = JSON.parse( fs.readFileSync(path.join(__dirname, '../data/preferences.json')) );
  }

  /**
   * @returns {string[]}
   */
  get preferences() {
    return Object.keys(this.mainObject);
  }
};
