// Libs
const Discord = require('discord.js')

// Files
const indexCommand = require('../commands/index.js')
const language = require('../utils/language.js')

// Variables
const { commands } = indexCommand
const commandList = Object.keys(commands)

/**
 * 
 * @param {Discord.Message} message 
 * @param {Object<string, new language.LanguageInstance>} languages
 */
exports.main = async (message, languages, { Sheet }) => {
    if (!message.content.startsWith(process.env.PREFIX)) return

    const content = message.content.split(process.env.PREFIX).join('').split(' ')[0]

    if (!commandList.includes(content)) return
    console.log(`Running command ${content}`)

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

    commands[content].run(message, languages[language], { Sheet })
}
