// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const embeds = require('../utils/embed.js')
const leaderboardMessage = require('../utils/leaderboardMessage.js')

/**
 *
 * @param {Discord.Message} message
 * @param {languageFile.LanguageInstance} language
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { args, archivalInstance }) => {

    const supportedVersions = archivalInstance.supportedVersions
    const supportedVersionsName = archivalInstance.supportedVersionsName

    const mainMessage = await message.reply({ content: 'Interact with the menu bellow' })
    const leaderboardManager = new leaderboardMessage.LeaderboardMessage(mainMessage, message, language)
    leaderboardManager.supportLookUp = true
    leaderboardManager.menuSelectPlaceholder = 'Select StepMania'
    leaderboardManager.leaderboardTitle = 'Select StepMania Version'
    leaderboardManager.lookUpFunc = (element) => {
        console.table(element)

        if (leaderboardManager.menuSelectPlaceholder === 'Select Theme') {
            return embeds.embedBuilder(element)
        }

        leaderboardManager.elements = []

        const versionName = archivalInstance.supportedVersions[archivalInstance.supportedVersionsName.indexOf(element.description)]
        const themes = archivalInstance.themesForVersion(versionName)
        for (let ind = 0; ind < themes.length; ind++) {
            const theme = archivalInstance.mainObject[versionName][themes[ind]]
            const themeObj = {}
            themeObj.title = `Summary of ${theme.Name}`
            themeObj.description = theme.Name
            themeObj.fields = []
            themeObj.fields.push({
                name: 'Theme Version',
                value: `This theme is made for ${element.description}`,
                inline: true
            })
            if (theme.Date) themeObj.fields.push({ name: 'Creation Date', value: theme.Date, inline: true })
            if (theme.Author) themeObj.fields.push({ name: 'Theme Author', value: theme.Author, inline: true })
            if (theme.Version) themeObj.fields.push({ name: 'Theme Version', value: theme.Version, inline: true })
            leaderboardManager.addElement(themeObj)
        }

        if (leaderboardManager.leaderboardTitle === 'Select StepMania Version') {
            leaderboardManager.lookingUp = false
            leaderboardManager.page = 0
        }
        leaderboardManager.leaderboardTitle = 'Select Theme to lookup'
        leaderboardManager.menuSelectPlaceholder = 'Select Theme'
        return embeds.embedBuilder({
            title: leaderboardManager.leaderboardTitle,
            description: leaderboardManager.pages.pageList[0],
            footer: `Page 1/${leaderboardManager.pages.pageList.length}`
        })
    }

    for (let i = 0; i < supportedVersions.length; i++) {
        leaderboardManager.addElement({
            description: supportedVersionsName[i]
        })
    }

    await leaderboardManager.updateMessage('init')
}
