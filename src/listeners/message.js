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
exports.main = async (message, languages) => {
    if (!message.content.startsWith(process.env.PREFIX)) return

    const content = message.content.split(process.env.PREFIX)[1]

    if (!commandList.includes(content)) return
    console.log(`Running command ${content}`)
    commands[content].run(message, languages['pt-br'])
}
