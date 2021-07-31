// Libs
const Discord = require('discord.js')

// Files
const indexCommand = require('./commands/index.js')
const message = require('./listeners/message.js')
const language = require('./utils/language.js')
const sheets = require('./utils/sheets.js')
const argument = require('./utils/argument.js')
// const indexCommand = require('./commands/index.js')

// Variables
const languages = {
  en: new language.LanguageInstance('en'),
  'pt-br': new language.LanguageInstance('pt-br'),
}
const sheetCache = new Map()
const { commands } = indexCommand
const commandList = Object.keys(commands)
/*
const { commands } = indexCommand
const commandList = Object.keys(commands)
const slashCommandsArr = []
*/

/**
 *
 * @async
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

  console.log('Init Sheet Instance')
  const Sheet = new sheets.SheetInstance()

  await Sheet.initAuth()
  await Sheet.doc.loadInfo()

  sheetCache.set('guild_languages', Sheet.doc.sheetsByTitle['guild_languages'])
  sheetCache.set('user_languages', Sheet.doc.sheetsByTitle['user_languages'])

  setInterval(() => {
    sheetCache.delete('guild_languages')
    sheetCache.delete('user_languages')
    sheetCache.set(
      'guild_languages',
      Sheet.doc.sheetsByTitle['guild_languages']
    )
    sheetCache.set('user_languages', Sheet.doc.sheetsByTitle['user_languages'])
  }, 60000)

  console.log('OutFoxing messages')

  client.on('messageCreate', (msg) => {
    if (!msg.content.toLowerCase().startsWith(process.env.PREFIX)) return
    if (!msg.guild) return
    if (msg.channel.type !== 'GUILD_TEXT') return
    if (!msg.channel.permissionsFor(client.user.id)?.has('SEND_MESSAGES'))
      return
    if (msg.author.bot) return

    const args = argument.filterArguments(msg)

    if (!commandList.includes(args.commandName[0])) return
    
    message.main(msg, languages, client, { Sheet, sheetCache, args, commands })
  })
}
