// Libs
const Discord = require('discord.js')
const Winston = require('winston')

// Files
const language = require('../utils/language.js')
const sheets = require('../utils/sheets.js')

// Variables
const userCooldown = new Set()
const busyState = new Set()

/**
 * Optional params
 * @typedef {Object} OptionalParams
 * @property {sheets.SheetInstance} OptionalParams.Sheet
 * @property {Object} args
 * @property {string[]} args.commandName
 * @property {string[]} [args.argument]
 * @property {string[]} [args.flag]
 * @property {Array<Array<string, string, string, string>>} [OptionalParams.leaderboard]
 * @property {Winston.Logger} logger
 */

/**
 * Message params
 * @typedef {Object} MessageEventParams
 * @function
 * @param {Discord.Message} message 
 * @param {Object<string, language.LanguageInstance>} languages 
 * @param {Discord.Client} client 
 * @param {OptionalParams} param3 
 */

/**
 * 
 * @param {Discord.Message} message 
 * @param {Object<string, language.LanguageInstance>} languages
 * @param {Discord.Client} client
 * @param {OptionalParams} param3
 */
exports.main = async (message, languages, client, { Sheet, ModsSheet, args, commands, leaderboard, logger }) => {
    logger.info(`Running command ${args.commandName[0]}`)
    logger.info(args)
    const rows = await Sheet.guildLanguages.getRows()
    const urows = await Sheet.userLanguages.getRows()
    let language = process.env.FALLBACKLANGUAGE

    const userDefined = urows.find(element => element.user === message.author.id)

    if (userDefined) {
        language = userDefined.language
    }

    if (!userDefined) {
        const guildDefined = rows.find(element => element.guild === message.guild.id)

        if (guildDefined) {
            language = guildDefined.language
        }
    }

    const commandLanguage = languages[language]
    if (userCooldown.has(message.author.id)) {
        message.reply({
            content: commandLanguage.readLine('generic', 'UsingCommandsTooFast')
        })
        return
    }

    if (busyState.has(message.author.id)) {
        message.reply({
            content: commandLanguage.readLine('generic', 'AnotherCommandStillProcessing')
        })
        return
    }

    busyState.add(message.author.id)
    await commands[args.commandName[0]].run(message, languages[language], { Sheet, ModsSheet, args, client, leaderboard, logger })
    userCooldown.add(message.author.id)
    setTimeout(() => {
        userCooldown.delete(message.author.id)
    }, 3000)
    busyState.delete(message.author.id)

}
