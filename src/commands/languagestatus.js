// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const embeds = require('../utils/embed.js')
const buttons = require('../utils/buttons.js')


/**
 *
 * @param {Discord.Message} message
 * @param {languageFile.LanguageInstance} language
 * @param {Discord.Client} client
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { args, languageStatus }) => {
    const embed = embeds.embedBuilder({
        color: '#ADBAC7',
        thumbnail: 'https://avatars.githubusercontent.com/u/66173034?s=200&v=4',
        url: 'https://github.com/Tiny-Foxes/OutFox-Translations',
    })

    if (!args.argument) {
        const currentVersionData = languageStatus[1]
        const version = currentVersionData[0]
        const versionLanguageStatus = []

        for (let i = 0; i < currentVersionData.length; i++) {
            if (i === 0) continue

            versionLanguageStatus.push(`${languageStatus[0][i]} - ${currentVersionData[i]}`)
        }

        embed.setTitle(`Language status of OutFox Alpha ${version} (latest)`)
        embed.setDescription(versionLanguageStatus.join('\n'))

        message.reply({ embeds: [embed] })
        return true
    }
    
    const versions = []
    const languages = []
    for (let i = 0; i < languageStatus.length; i++) {
        if (i === 0) {
            languageStatus[1].forEach(language => language !== 'Version' ? languages.push(language) : false)
        }

        versions.push(languageStatus[i][0])
    }

    if (!versions.includes(args.argument) && !languages.includes(args.argument)) {
        message.reply(`Please give a **version number** or **language name** as argument if you want more info.\n\n
        **Version Numbers**\n\`${versions.join('`, `')}\n\n
        **Language Names\n\`${languages.join('`, `')}`)
    }
}
