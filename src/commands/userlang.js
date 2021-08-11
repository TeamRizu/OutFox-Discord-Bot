// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')

// Variables
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = Discord
const cooldown = new Set()

/**
 * 
 * @param {Discord.Message} message 
 * @param {languageFile.LanguageInstance} language
 * @param {Discord.Client} client
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { Sheet, args }) => {
    if (cooldown.has(message.author.id)) {
        message.reply({ content: language.readLine('userlang', 'UserOnCooldown') })
        return
    }
    /*
    if (!args.argument) {
        message.reply({ content: language.readLine('generic', 'MissingArgument') })
        return
    }
    */

    const userLanguages = Sheet.doc.sheetsByTitle['user_languages']
    const rows = await userLanguages.getRows()
    const userDefined = rows.find(element => element.user === message.author.id)

    const setLanguage = new MessageButton()
        .setCustomId('setlang' + message.id)
        .setLabel('Set my language')
        .setStyle('PRIMARY')
    const deleteMyLanguage = new MessageButton()
        .setCustomId('deletelang' + message.id)
        .setLabel('Delete my language')
        .setStyle('DANGER')
        .setDisabled(true)
    const nevermind = new MessageButton()
        .setCustomId('nevermind' + message.id)
        .setLabel('nevermind')
        .setStyle('SECONDARY')

    if (!userDefined) deleteMyLanguage.setDisabled(true)

    const languages = language.readLine('languages', undefined, {}, { languageFile: language.global })
    let languageSelects = []
    
    for (let i = 0; i < Object.keys(language).length; i++) {
        languageSelects.push({
            label: `${language.readLine('generic', 'emoji')} ${languages[Object.values(languages)[i]]}`,
            value: `ofl-${message.id}-${languages[Object.keys(languages)[i]]}`
        })
    }

    const languageSelector = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select' + message.id)
            .setPlaceholder('Select your Language')
            .addOptions(languageSelects)
    )

    const embed = new MessageEmbed()
    .setTitle('What you want to do?')

    const comp = new MessageActionRow().addComponents(setLanguage, deleteMyLanguage, nevermind)

    await message.reply({ embeds: [embed], components: [comp] })

    const languageFilter = (i) => {
        if (!i.value || typeof i.value !== string || i.split('-').length !== 3) return false

        // TODO: make a variable that splits the interaction value and check if the language present there is supported by the bot.
        return true
    }

    return true
    const lang = args.argument[0].toLowerCase()

    if (!language.supportedLanguages.includes(lang)) {
        message.reply(
            { 
                content: language.readLine('userlang', 'LanguageNotSupported') + '\n```\n' + language.supportedLanguages.join('\n') + '```' 
            }
        )
        return
    }

    

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