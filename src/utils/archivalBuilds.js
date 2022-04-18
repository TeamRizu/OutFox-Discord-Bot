const request = require('request-promise');

/**
 * Accepted Archive build list IDs
 * @typedef {'DDRPC' | 'SM095' | 'SM164' | 'SM30' | 'SM39' | 'SM395' | 'OITG' | 'NOTITG' | 'SM4' | 'SMSSC' | 'SMSSCCUSTOM' | 'SM5' | 'ETT' | 'OUTFOX'} BuildListID
 */

/**
 * Array of Archive build list IDs
 * @typedef {['DDRPC', 'SM095', 'SM164', 'SM30', 'SM39', 'SM395', 'OITG', 'NOTITG', 'SM4', 'SMSSC', 'SMSSCCUSTOM', 'SM5', 'ETT', 'OUTFOX']} BuildListIDs
 */

/**
 * Array of Archive build list names
 * @typedef {['DDR PC Edition ', 'StepMania 0.9x', 'StepMania 1.64', 'StepMania 3.0', 'StepMania 3.9', 'StepMania 3.95 (Main and Based builds)', 'OpenITG based builds', 'NotITG based builds', 'StepMania 4.0 Normal/CVS Builds', 'SM-SSC - StepMania 5.0 Alpha/Beta Builds', 'SM-SSC - StepMania 5.0 Custom Builds', 'StepMania 5', 'Etterna', 'Project OutFox']} BuildListName
 */

/**
 * Object of Archive Build List
 * @typedef {Object} BuildList
 * @property {string} Name
 * @property {string} DefaultIcon
 * @property {string} [Description]
 * @property {BuildListed[]} Listing
 */

/**
 * Object of Archive BuildListed
 * @typedef {Object} BuildListed
 * @property {string} Name
 * @property {string} [Date] - YYYY/MM/DD
 * @property {string} [ID] - ChangeLog ID (eg. Builds/BuildChangeLogs.html?Version=ITGB01072004)
 * @property {string | OSBuildOptions[]} [Windows]
 * @property {string | OSBuildOptions[]} [Mac]
 * @property {string | OSBuildOptions[]} [Linux]
 * @property {string | OSBuildOptions[]} [Src]
 */

/**
 * Object of Archive OS Build Options
 * @typedef {Object} OSBuildOptions
 * @property {string} Name - Can have HTML tags
 * @property {string} Link
 */

exports.ArchiveBuildsFile = class ArchiveBuildsInstance {
  constructor() {
    /** @type {string} */
    this.sourceURL = 'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Builds/BuildListing.json';
    /**
     * The object that contains all BuildListing Data
     * @type {Object<string, BuildList>}
    */
    this.mainObject = null;
  }

  async setup() {
    const body = await request(this.sourceURL);

    this.mainObject = JSON.parse(body);
  }

  /**
   * @returns {BuildListIDs}
   */
  get buildListIDs() {
    return Object.keys(this.mainObject);
  }

  /**
   * @returns {BuildListName}
   */
  get buildListName() {
    const finalArr = []

    for (let i = 0; i < this.buildListIDs.length; i++) {
      finalArr.push(this.mainObject[this.buildListIDs[i]].Name)
    }

    return finalArr
  }

  /**
   *
   * @param {BuildListID} buildListID
   * @returns {BuildList}
   */
  buildListObjectFromID(buildListID) {
    return this.mainObject[buildListID]
  }

  /**
   *
   * @param {BuildListID} buildListID
   * @returns {string[]}
   */
  listingNamesFromID(buildListID) {
    const engine = this.buildListObjectFromID(buildListID)
    const finalArr = []

    for (let i = 0; i < engine.Listing.length; i++) {
      finalArr.push(engine.Listing[i].Name)
    }

    return finalArr
  }
};
