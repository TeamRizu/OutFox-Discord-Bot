// Libs
const Discord = require('discord.js')

// Files
const languageFile = require('../utils/language.js')
const messageFile = require('../listeners/message.js')

// Variables
const { MessageSelectMenu, MessageActionRow } = Discord

/**
 * 
 * @param {Discord.Message} message 
 * @param {languageFile.LanguageInstance} language
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { Sheet, args }) => {
    // TODO: everything.  https://github.com/kaikecarlos/zerinho6-bot-2.2.1/blob/master/comandos/reload.js
}