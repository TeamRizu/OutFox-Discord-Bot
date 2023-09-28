require('dotenv').config()
const { SlashCreator, FastifyServer } = require('slash-create')
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { parseSMSSC, resumeSMSSC } = require('./utils/sm-ssc-helpers.js')

const axios = require('axios')

const path = require('path')
const CatLoggr = require('cat-loggr')

const start = async () => {
  const logger = new CatLoggr().setLevel(
    process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info'
  )
  const creator = new SlashCreator({
    applicationID: process.env.DISCORD_APP_ID,
    publicKey: process.env.DISCORD_PUBLIC_KEY,
    token: process.env.DISCORD_BOT_TOKEN,
    serverPort: parseInt(process.env.PORT, 10) || 8020,
    serverHost: '0.0.0.0'
  })
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

  client.once(Events.ClientReady, c => {
    console.log('Discord.JS client is up.')
  })

  client.on('messageCreate', async (message) => {
    const acceptedGuilds = [
      '422897054386225173', // Project OutFox
      '490329576300609536', // Moru School Guild
      '298518634765221890' // Spotlight Brasil
    ]
    const acceptedChannels = [
      '1156687789455315006', // Private test
      '1070308952383967252' // Serenity Space
    ]

    if (!acceptedGuilds.includes(message.guildId) || message.author.bot || 0 >= message.attachments.size || !message.attachments.at(0)?.name.endsWith('.ssc')) return
    if (!acceptedChannels.includes(message.channel.parentId) && !message.content.includes('--force')) return

    const requestChart = await axios.get(message.attachments.at(0).url)

    if (requestChart.status !== 200) {
      console.error(`Error while trying to get file from URL (${message.attachments.at(0).url})`)
      message.reply('Sorry, I had a problem trying to get the file, can you send it again? If it still does not work then try reporting the problem to moderators.')
      return
    }

    const chartData = requestChart.data
    const isForced = message.content.includes('--force')
    
    try {
      const chart = parseSMSSC(chartData)
      const [sucessStatus, resumeMessage] = await resumeSMSSC(chart, {skipCompare: isForced})

      if (resumeMessage.length > 2000) {
        const contentNeededCut = resumeMessage.length > 4096
        const replyEmbed = new EmbedBuilder()
        .setColor(isForced ? '#fad0a2' : '#2f6449')
        .setTitle(`SM-SSC Resume - ${sucessStatus ? '✅ Sucess' : ':x: Failed'}`)
        .setDescription(contentNeededCut ? resumeMessage.substring(0, 4000) + '\n\n**The file you sent has too many charts, some resumes have been cut.**'.toUpperCase() : resumeMessage)
        .setFooter({ text: 'This uses a custom sm-ssc parser written by Moru, files can fail here and pass in-game.' })

        message.reply({
          embeds: [replyEmbed]
        })
      } else {
        message.reply(resumeMessage)
      }
      
    } catch (e) {
      console.error('Error while trying to parse chart, ', e)
    }
  })

  creator.on('debug', (message) => logger.log(message))
  creator.on('warn', (message) => logger.warn(message))
  creator.on('error', (error) => logger.error(error))
  creator.on('synced', () => logger.info('Commands synced!'))
  creator.on('commandRun', (command, _, ctx) =>
    logger.info(
      `${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`
    )
  )
  creator.on('commandRegister', (command) =>
    logger.info(`Registered command ${command.commandName}`)
  )
  creator.on('commandError', (command, error) =>
    logger.error(`Command ${command.commandName}:`, error)
  )

  creator
    .withServer(new FastifyServer())
    .registerCommandsIn(path.join(__dirname, 'registers'))
    .startServer()

  client.login(process.env.DISCORD_BOT_TOKEN)
  console.log(
    `Starting server at "localhost:${creator.options.serverPort}/interactions"`
  )
}

start()
