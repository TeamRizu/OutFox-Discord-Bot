const request = require('request-promise');

exports.ArchiveCreditsFile = class ArchiveCreditsInstance {
  constructor() {
    /**
     * @type {string}
     */
    this.sourceURL = 'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Builds/Credits/data.json';
    /**
     * @type {Object<string, Array<CreditSection>>}
     */
    this.mainObject = null;
  }

  async setup() {
    const body = await request(this.sourceURL);

    this.mainObject = JSON.parse(body);
  }

  /**
   * @returns {CreditedEngine[]}
   */
  get engines() {
    return Object.keys(this.mainObject).filter(e => e !== 'Mung3');
  }

  /**
   *
   * @param {CreditedEngine} engine
   * @returns {string[]}
   */
  creditsTitleByEngine(engine) {
    if (!this.engines.includes(engine)) {
      return []
    }

    const credits = this.mainObject[engine]
    const finalArr = []

    for (let i = 0; i < credits.length; i++) {
      finalArr.push(credits[i].title)
    }

    return finalArr
  }
};
