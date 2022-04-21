const request = require('request-promise');

exports.ArchiveAnnouncersFile = class ArchiveAnnouncersInstance {
  constructor() {
    /**
     * @type {string}
     */
    this.sourceURL = 'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Announcers/db.json';
    /**
     * @type {Object<string, AnnouncerObject>}
     */
    this.mainObject = null;
  }

  async setup() {
    const body = await request(this.sourceURL);

    this.mainObject = JSON.parse(body);
  }

  /**
   * @returns {AnnouncersNames}
   */
  get announcers() {
    return Object.keys(this.mainObject);
  }

  /**
   * @returns {Object<string, AnnouncerName[]>}
   */
  get announcersFromAuthors() {
    const finalObj = {}
    const announcersObj = Object.values(this.mainObject)
    const announcersName = this.announcers

    for (let i = 0; i < announcersObj.length; i++) {
      const author = announcersObj[i].Author || 'Unlisted'

      if (!finalObj[author]) {
        finalObj[author] = []
      }

      finalObj[author].push(announcersName[i])
    }

    return finalObj
  }

  /**
   *
   * @param {AnnouncerCreator} author
   * @returns {AnnouncerName[]}
   */
  announcersByAuthor(author) {
    if (!this.announcersFromAuthors[author]) {
      return []
    }

    const finalArr = []
    const announcersFromAuthor = this.announcersFromAuthors[author]

    for (let i = 0; i < announcersFromAuthor.length; i++) {
      const announcerName = announcersFromAuthor[i]

      finalArr.push({
        name: announcerName
      })
    }

    return finalArr
  }
};
