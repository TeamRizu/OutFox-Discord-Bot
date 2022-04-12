const fs = require('fs')
const path = require('path')

exports.WikiPreferencesFile = class WikiPreferencesInstance {
  constructor() {
    this.mainObject = JSON.parse( fs.readFileSync(path.join(__dirname, '../data/preferences.json')) );
  }

  /**
   * @returns {string[]}
   */
  get preferences() {
    return Object.keys(this.mainObject);
  }
};
