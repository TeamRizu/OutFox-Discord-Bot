// Libs
const Discord = require('discord.js')

// Files
const languageFile = require('../utils/language.js')

// Variables
const cooldown = new Set()

/**
 * Executes a function which tests the delay on editing a message after sending one.
 * @async
 * @param {Discord.Message} message 
 * @param {new languageFile.LanguageInstance} language
 */
exports.run = async (message, language, { Sheet, args }) => {

    if (!message.guild.members.resolve(message.author.id)) {
        message.reply({ content: language.readLine('guildlang', 'UnableToVerifyMember') })
        return
    }

    const member = message.guild.members.resolve(message.author.id)

    if (!member.permissions.has('MANAGE_GUILD')) {
        message.reply(
            {
                content: language.readLine('generic', 'YouNeedThisPermission',
                {
                    permission: 'MANAGE_GUILD'
                })
            }
        )
    }

    if (cooldown.has(message.guild.id)) {
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

    const guildLanguages = Sheet.doc.sheetsByTitle['guild_languages']
    const rows = await guildLanguages.getRows()
    const guildDefined = rows.find(element => element.guild === message.guild.id)

    if (guildDefined) {
        if (guildDefined.language === lang) {
            message.reply({
                content: language.readLine('userlang', 'LanguageAlreadyDefined')
            })
            return
        }

        guildDefined.language = lang
        await guildDefined.save()
        message.reply(
            {
                content: language.readLine('guildlang', 'LanguageUpdated')
            }
        )
        cooldown.add(message.guild.id)
        setTimeout(() => {
            cooldown.delete(message.guild.id)
        }, 18000)
    }
}