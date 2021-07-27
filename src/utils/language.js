// Libs
const fs = require('fs')
const ini = require('ini')
const path = require('path')

exports.LanguageInstance = class {
    /**
     * 
     * @param {string} [lang] - The language code. 
     */
    constructor(lang) {
        this.fallbackLanguage = process.env.FALLBACKLANGUAGE
        this.language = lang || this.fallbackLanguage
        this.languageFile = ini.parse(fs.readFileSync(path.join(__dirname, `../languages/${this.language}.ini`), 'utf-8'))
        this.fallbackLanguageFile = ini.parse(fs.readFileSync(path.join(__dirname, `../languages/${this.fallbackLanguage}.ini`), 'utf-8'))
    }

    /**
     * Updates current language and language file.
     * @param {string} [language] - The language code.
     */
    parseUpdate(language = this.language) {
        this.language = language
        this.languageFile = ini.parse(fs.readFileSync(path.join(__dirname, `../languages/${this.language}.ini`), 'utf-8'))
    }

    /**
     * Returns an group object, or request line.
     * @param {string} group - The group name
     * @param {string} key - The line nane 
     * @param {Object<string, (string | number)>} [context]
     * @returns {string | object}
     */
    readLine(group, key, context) {
        if (!this.languageFile[group]) return null

        if (!key) return this.languageFile[group]

        let line = this.languageFile[group][key] 

        const applyContext = () => {
            const keys = Object.keys(context)
            for (let i = 0; i < keys.length; i++) {
                const currentKeyValue = context[keys[i]]
                line = line.replace(`{{${keys[i]}}}`, currentKeyValue)
            }
        }

        if (!line) {
            line = this.fallbackLanguageFile[group][key]
            if (!context) return line 
            applyContext()
            return line
        }

        if (!context) return line
               
        applyContext()

        return line
    }
}
