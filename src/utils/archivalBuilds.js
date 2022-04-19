const request = require('request-promise');

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
   * @returns {ArchiveListIDs}
   */
  get buildListIDs() {
    return Object.keys(this.mainObject);
  }

  /**
   * @returns {ArchiveListNames}
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
