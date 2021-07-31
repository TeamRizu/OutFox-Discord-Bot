// Libs
const Discord = require('discord.js')

// Files
const indexCommand = require('../commands/index.js')
const language = require('../utils/language.js')
const argument = require('../utils/argument.js')

// Variables
const { commands } = indexCommand
const commandList = Object.keys(commands)

/**
 * 
 * @param {Discord.Message} message 
 * @param {Object<string, new language.LanguageInstance>} languages
 * @param {Discord.Client} client
 */
exports.main = async (message, languages, client, { Sheet }) => {
    if (!message.content.toLowerCase().startsWith(process.env.PREFIX)) return
    if (!message.guild) return
        console.log(message.channel.type)
    if (message.channel.type !== 'GUILD_TEXT') return
    if (!message.channel.permissionsFor(client.user.id)?.has('SEND_MESSAGES')) return
    if (message.author.bot) return

    const args = argument.filterArguments(message)
    // message.content.split(process.env.PREFIX).join('').split(' ')[0]

    if (!commandList.includes(args.commandName[0])) return
    console.log(`Running command ${args.commandName[0]}`)
    console.log(args)
    const sh = Sheet.doc.sheetsByTitle['guild_languages']
    const ush = Sheet.doc.sheetsByTitle['user_languages']
    const rows = await sh.getRows()
    const urows = await ush.getRows()
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

    commands[args.commandName[0]].run(message, languages[language], { Sheet, args })
}
