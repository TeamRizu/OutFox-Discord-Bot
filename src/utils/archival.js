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
        if (!supportedVersions.includes(version)) return null

        const versionThemes = themesForVersion(version)

        if (!versionThemes.includes(themeName)) return null

        return versionThemes[themeName]
    }

    themeVersions(version, themeName) {
        if (!themeFromVersion(version, themeName)) return null

        const theme = themesForVersion(version)[themeName]

        if (!Array.isArray(theme.link)) return null

        const versions = []

        for (let i = 0; i < theme.link.length; i++) {
            versions.push(theme.link[i].Name)
        }

        return versions
    }
}
