// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')

// Variables
const cooldown = new Set()

/**
 * 
 * @param {Discord.Message} message 
 * @param {Object<string, languageFile.LanguageInstance>} languages
 * @param {Discord.Client} client
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, _, { Sheet, args }) => {
    if (cooldown.has(message.author.id)) {
        message.reply({ content: language.readLine('userlang', 'UserOnCooldown') })
        return
    }

    if (!args.argument) {
        message.reply({ content: language.readLine('generic', 'MissingArgument') })
        return
    }

    const lang = args.argument[0].toLowerCase()

    if (!language.supportedLanguages.includes(lang)) {
        message.reply(
            { 
                content: language.readLine('userlang', 'LanguageNotSupported') + '\n```\n' + language.supportedLanguages.join('\n') + '```' 
            }
        )
        return
    }

    const userLanguages = Sheet.doc.sheetsByTitle['user_languages']
    const rows = await userLanguages.getRows()
    const userDefined = rows.find(element => element.user === message.author.id)

    if (userDefined) {
        if (userDefined.language === lang) {
            message.reply({
                content: language.readLine('userlang', 'LanguageAlreadyDefined')
            })
            return
        }

        userDefined.language = lang
        await userDefined.save()
        message.reply(
            {
                content: language.readLine('userlang', 'LanguageUpdated')
            }
        )
        cooldown.add(message.author.id)
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, 18000)
    } else {
        await userLanguages.addRow({ user: message.author.id, language: lang })
        message.reply(
            {
                content: language.readLine('userlang', 'LanguageImplemented')
            }
        )
        cooldown.add(message.author.id)
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, 18000)
    }

    return true
}