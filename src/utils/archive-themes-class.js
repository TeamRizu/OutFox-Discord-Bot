const axios = require('axios')

exports.ArchiveAnnouncersClass = class ArchiveAnnouncersClass {
  constructor () {
    /**
     * @type {string}
     */
    this.sourceURL =
      'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Themes/db.json'
    this.mainObject = null
  }

  async setup () {
    const body = await axios.get(this.sourceURL)

    this.mainObject = body.data
  }

  /**
   * @returns {Array<string>}
   */
  get supportedVersions () {
    return Object.keys(this.mainObject)
  }

  /**
   * @returns {string}
   */
  get supportedVersionsName () {
    const versions = []

    for (let i = 0; i < Object.keys(this.mainObject).length; i++) {
      versions.push(this.mainObject[Object.keys(this.mainObject)[i]].Name)
    }

    return versions
  }

  /**
   *
   * @param {string} version
   * @returns {string[]}
   */
  themesForVersion (version) {
    if (!this.supportedVersions.includes(version)) return null

    const themes = Object.keys(this.mainObject[version])

    themes.shift() // Remove version name.
    themes.shift() // Remove version icon.
    return themes
  }

  /**
   *
   * @param {string} version
   * @param {string} themeName
   */
  themeFromVersion (version, themeName) {
    if (!this.supportedVersions.includes(version)) return null

    const versionThemes = this.themesForVersion(version)

    if (!versionThemes.includes(themeName)) return null

    return this.mainObject[version][themeName]
  }
}
