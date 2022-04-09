const request = require('request-promise');

exports.ArchiveCreditsFile = class ArchiveCreditsInstance {
  constructor() {
    this.sourceURL = 'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Builds/Credits/data.json';
    this.mainObject = null;
  }

  async setup() {
    const body = await request(this.sourceURL);

    this.mainObject = JSON.parse(body);
  }

  /**
   * @returns {string[]}
   */
  get engines() {
    return Object.keys(this.mainObject).filter(e => e !== 'Mung3');
  }

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
