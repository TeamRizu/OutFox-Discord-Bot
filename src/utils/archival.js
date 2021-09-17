const request = require('request-promise')

exports.ArchiveInstance = class {
    constructor() {
        this.sourceURL = 'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Themes/db.json'
        this.mainObject = null
    }

    async setup() {
        const body = await request(this.sourceURL)

        this.mainObject = body

        return body
    }

    /**
     * @returns {string[]}
     */
    get supportedVersions() {
        return Object.keys(this.mainObject)
    }

    /**
     * @returns {string[]}
     */
    get supportedVersionsName() {
        const versions = []

        for (let i = 0; i < Object.keys(this.mainObject).length; i++) {
            versions.push(this.mainObject[Object.keys(mainObject)[i]].Name)
        }

        return versions
    }

    /**
     * 
     * @param {string} version
     * @returns {string[]|null}
     */
    themesForVersion(version) {
        if (!supportedVersions.includes(version)) return null

        const themes = Object.keys(this.mainObject[version])

        themes.shift()

        return themes
    }

    themeFromVersion(version, themeName) {
        // TODO: Everything.
    }
}
