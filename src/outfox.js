// Libs
const Discord = require('discord.js')
const Winston = require('winston')

// Files
const indexCommand = require('./commands/index.js')
const message = require('./listeners/message.js')
const language = require('./utils/language.js')
const languageSheets = require('./utils/languageSheet.js')
const argument = require('./utils/argument.js')
const leaderboard = require('./utils/leaderboard.js')
const modsSheets = require('./utils/modsSheet.js')
const languageStatus = require('./utils/languageStatus.js')
const archival = require('./utils/archival.js')

// Variables
const languages = {
    en: new language.LanguageInstance('en'),
    'pt-BR': new language.LanguageInstance('pt-BR'),
}
const { commands } = indexCommand
const commandList = Object.keys(commands)
const archivalInstance = new archival.ArchiveInstance()
let leaderboardObj = new Map()
let languageObj = new Map()



/**
 *
 * @async
 * @param {Discord.Client} client
 * @param {Winston.Logger} logger
 */
exports.main = async (client, logger) => {
    /*

    Slash commands require some really
    dumb invite setup I'm not going to do it. ~ zerinho6


    console.log('Setup Slash Commands.')
    
    for (let i = 0; i < commandList.length; i++) {
        slashCommandsArr.push(commands[commandList[i]].slashCommand)
    }

    await client.guilds.cache.get(process.env.DEVSERVER)?.commands.set(slashCommandsArr)
    */

    logger.info('Init Language Sheet Instance')
    const Sheet = new languageSheets.LanguageSheetInstance()
    await Sheet.init()

    logger.info('Init Mods Sheet Instance')
    const ModsSheet = new modsSheets.ModsSheetInstance()
    await ModsSheet.init()

    logger.info('Setup Leaderboard')
    const ldInfo = await leaderboard.leaderboard()
    leaderboardObj.set('obj', ldInfo)

    logger.info('Setup Language Status')
    const lgInfo = await languageStatus.languageStatus()
    languageObj.set('obj', lgInfo)

    setInterval(async () => {
        leaderboardObj.delete('obj')
        const updatedLdInfo = await leaderboard.leaderboard()
        leaderboardObj.set('obj', updatedLdInfo)
    }, 60000)

    logger.info('OutFoxing messages')

    await archivalInstance.setup()
    logger.info('Archival up')

    client.on('messageCreate', (msg) => {
        if (!msg.content.toLowerCase().startsWith(process.env.PREFIX)) return
        if (!msg.guild) return
        if (msg.channel.type !== 'GUILD_TEXT') return
        if (!msg.channel.permissionsFor(client.user.id)?.has('SEND_MESSAGES'))
            return
        if (msg.author.bot) return

        const args = argument.filterArguments(msg)

        if (!commandList.includes(args.commandName[0])) return
        message.main(msg, languages, client, {
            Sheet,
            ModsSheet,
            args,
            languageStatus: languageObj.get('obj'),
            leaderboard: leaderboardObj.get('obj'),
            commands,
            archivalInstance,
            logger,
        })
    })

    client.on('error', (err) => {
        console.warn(err)
    })
}
