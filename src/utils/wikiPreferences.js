const fs = require('fs')
const path = require('path')

exports.WikiPreferencesFile = class WikiPreferencesInstance {
  constructor() {
    this.mainObject = null;
  }

  async setup() {
    this.mainObject = JSON.parse( fs.readFileSync(path.join(__dirname, '../data/preferences.json'), { encoding: 'utf-8' }) );
  }

  /**
   * @returns {string[]}
   */
  get preferences() {
    return Object.keys(this.mainObject);
  }
};
