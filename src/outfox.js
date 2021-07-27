// Libs
const Discord = require('discord.js')

// Files
const message = require('./listeners/message.js')
const language = require('./utils/language.js')
// const indexCommand = require('./commands/index.js')

// Variables
const languages = {
    en: new language.LanguageInstance('en'),
    'pt-br': new language.LanguageInstance('pt-br')
}
/*
const { commands } = indexCommand
const commandList = Object.keys(commands)
const slashCommandsArr = []
*/

/**
 * 
 * @param {Discord.Client} client 
 */
exports.main = async (client) => {

    /*

    Slash commands are not available for everyone yet.
    That's why this is commented out. - Zerinho6


    console.log('Setup Slash Commands.')
    
    for (let i = 0; i < commandList.length; i++) {
        slashCommandsArr.push(commands[commandList[i]].slashCommand)
    }

    await client.guilds.cache.get(process.env.DEVSERVER)?.commands.set(slashCommandsArr)
    */

    console.log('OutFoxing messages')

    client.on('messageCreate', (msg) => {
        message.main(msg, languages)
    })
}
