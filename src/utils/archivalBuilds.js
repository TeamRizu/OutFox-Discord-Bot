const request = require('request-promise');

exports.ArchiveBuildsFile = class ArchiveBuildsInstance {
  constructor() {
    /** @type {string} */
    this.sourceURL = 'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Builds/BuildListing.json';
    /**
     * The object that contains all BuildListing Data
     * @type {import('../types/tsTypes/types').ArchiveBuilds}
     */
    this.mainObject = null;
  }

  async setup() {
    /**
     * @type {import('../types/tsTypes/types').ArchiveBuilds}
     */
    const body = await request(this.sourceURL);

    this.mainObject = JSON.parse(body);
  }

  /**
   * @returns {Array<string>}
   */
  get buildListIDs() {
    return Object.keys(this.mainObject);
  }

  /**
   * @returns {Array<string>}
   */
  get buildListName() {
    const finalArr = [];

    for (let i = 0; i < this.buildListIDs.length; i++) {
      finalArr.push(this.mainObject[this.buildListIDs[i]].Name);
    }

    return finalArr;
  }

  /**
   *
   * @param {string} buildListID
   * @returns {import('../types/tsTypes/types').BuildList}
   */
  buildListObjectFromID(buildListID) {
    return this.mainObject[buildListID];
  }

  /**
   *
   * @param {string} buildListID
   * @returns {string[]}
   */
  listingNamesFromID(buildListID) {
    const engine = this.buildListObjectFromID(buildListID);
    const finalArr = [];

    for (let i = 0; i < engine.Listing.length; i++) {
      finalArr.push(engine.Listing[i].Name);
    }

    return finalArr;
  }
};
