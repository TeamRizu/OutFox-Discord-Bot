const request = require('request-promise');

exports.ArchiveThemesFile = class ArchiveThemesInstance {
  constructor() {
    /**
     * @type {string}
     */
    this.sourceURL = 'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Themes/db.json';
    /**
     * @type {Object<string, Object<string, import('../types/types').ThemeObject>>}
     */
    this.mainObject = null;
  }

  async setup() {
    const body = await request(this.sourceURL);

    this.mainObject = JSON.parse(body);
  }

  /**
   * @returns {import('../types/types').ArchiveEngineIDs}
   */
  get supportedVersions() {
    return Object.keys(this.mainObject);
  }

  /**
   * @returns {import('../types/types').ArchiveEngineName[]}
   */
  get supportedVersionsName() {
    const versions = [];

    for (let i = 0; i < Object.keys(this.mainObject).length; i++) {
      versions.push(this.mainObject[Object.keys(this.mainObject)[i]].Name);
    }

    return versions;
  }

  /**
   *
   * @param {import('../types/types').ArchiveEngineID} version
   * @returns {string[]}
   */
  themesForVersion(version) {
    if (!this.supportedVersions.includes(version)) return null;

    const themes = Object.keys(this.mainObject[version]);

    themes.shift(); // Remove version name.
    return themes;
  }

  /**
   *
   * @param {import('../types/types').ArchiveEngineID} version
   * @param {string} themeName
   * @returns {import('../types/types').ThemeObject}
   */
  themeFromVersion(version, themeName) {
    if (!this.supportedVersions.includes(version)) return null;

    const versionThemes = this.themesForVersion(version);

    if (!versionThemes.includes(themeName)) return null;

    return this.mainObject[version][themeName];
  }
};
