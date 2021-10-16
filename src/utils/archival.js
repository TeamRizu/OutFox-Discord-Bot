const request = require('request-promise')

exports.ArchiveInstance = class {
    constructor() {
        this.sourceURL = 'https://cdn.jsdelivr.net/gh/JoseVarelaP/StepMania-Archive/Themes/db.json'
        this.mainObject = null
    }

    async setup() {
        const body = await request(this.sourceURL)

        this.mainObject = JSON.parse(body)
        /*
        const db = JSON.parse(body)

        for (let i = 0; i < Object.keys(db).length; i++) { // SM Versions
            const versionName = Object.keys(db)[i]
            for (let t = 0; t < Object.keys(db[versionName]).length; t++) { // Themes
                const themeName = Object.keys(db[versionName])[t]
                
                if (themeName === 'Name') continue

                // TODO: Add each theme to mainObject, theme name as the index key and add any valuable information as the object value.
            }
        }

        return body
        */
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
            versions.push(this.mainObject[Object.keys(this.mainObject)[i]].Name)
        }

        return versions
    }

    /**
     * 
     * @param {string} version
     * @returns {string[]|null}
     */
    themesForVersion(version) {
        if (!this.supportedVersions.includes(version)) return null

        const themes = Object.keys(this.mainObject[version])

        themes.shift() // Remove version name.
        console.log('returning themes')
        return themes
    }

    themeFromVersion(version, themeName) {
        console.log(version, themeName)
        if (!this.supportedVersions.includes(version)) return null

        const versionThemes = this.themesForVersion(version)

        if (!versionThemes.includes(themeName)) return null

        return this.mainObject[version][themeName]
    }

    themeVersions(version, themeName) {
        if (!this.themeFromVersion(version, themeName)) return null

        const theme = this.themesForVersion(version)[themeName]

        if (!Array.isArray(theme.link)) return null

        const versions = []

        for (let i = 0; i < theme.link.length; i++) {
            versions.push(theme.link[i].Name)
        }

        return versions
    }
}