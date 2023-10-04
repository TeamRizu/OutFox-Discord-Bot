require('dotenv').config()
const { SlashCreator, FastifyServer } = require('slash-create')
const { Client, Events, GatewayIntentBits, EmbedBuilder, Message, Attachment, PermissionFlagsBits } = require('discord.js');
const { parseSMSSC, resumeSMSSC } = require('./utils/sm-ssc-helpers.js')
const { parseLog, resumeLog } = require('./utils/log-helpers.js')

const axios = require('axios')
const path = require('path')
const CatLoggr = require('cat-loggr')

let hundredthMembersAtStartup = 0

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

  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers ] });
  const outfoxServer = '422897054386225173'
  const outfoxStaffChannel = '672182750521851923'
  const outfoxStaffSpam = '688182781263609868'
  const serenity_space = '1070308952383967252'

  const autoReplyChannelsForSMSSC = [
    serenity_space,
    '1156687789455315006' // coisa-minha
  ]

  const autoReplyChannelsForMainlog = [
    '1156687789455315006', // coisa-minha
    '527732010714923019', // bugs-crashlogs
    '428678897815781378', // troubleshooting
    '1070335916750684241', // alpha5-bug-reporting
    '1070335225047023656' // alpha4-bug-reporting
  ]

  client.once(Events.ClientReady, c => {
    console.log('Discord.JS client is up.')
    hundredthMembersAtStartup = c.guilds.cache.get(process.env.DEVELOPMENT_GUILD_ID || outfoxServer).memberCount || 2354
  })

  
  /**
   * 
   * @param {Message} msg 
   * @param {*} param1 
   * @returns {Attachment | null}
   */
  const attachmentFromMessage = (msg, { isFromAutoChannel, isForced, isReplyRequest } = { isFromAutoChannel: false, isForced: false, isReplyRequest: false }) => {
    if (isReplyRequest) {
      const replyChannel = client.channels.cache.get(msg.reference.channelId)

      if (!replyChannel) {
        msg.reply('Something happened while trying to get the channel fo the message you replied to.')
        return null
      }

      const replyMessage = replyChannel?.messages?.cache?.get(msg.reference.messageId)

      if (!replyMessage) {
        msg.reply('Something happened while trying to get the message you replied to.')
        return null
      }

      const attachment = replyMessage?.attachments?.at(0)?.url

      if (!attachment) {
        msg.reply('The message you replied to has no attachment.')
        return null
      }

      return replyMessage.attachments.at(0)
    }

    const attachment = msg.attachments?.at(0)?.url

    if (isForced) {

      if (!attachment) msg.reply('Your message has no attachments.')
  
      return msg.attachments.at(0)
    }

    if (!attachment) return null

    return msg.attachments.at(0)
  }

  const getThirdFromRight = (number) => {
    const numStr = number.toString()
    
    const index = numStr.length - 3
    
    if (index >= 0) {
      return parseInt(numStr.charAt(index))
    }

    return 0
  }

  const acceptedFileTypes = ['ssc', 'sm', 'log']

  let channelIdsToLookFor = []
  channelIdsToLookFor.push(autoReplyChannelsForMainlog)
  channelIdsToLookFor.push(autoReplyChannelsForSMSSC)
  channelIdsToLookFor = channelIdsToLookFor.flat()


  client.on('guildMemberAdd', (gMember) => {
    if (gMember.guild.id !== outfoxServer) return

    const channelToAnnounceHundredthMember = client.channels.cache.get(outfoxStaffChannel)
    
    if (getThirdFromRight(gMember.guild.memberCount) !== hundredthMembersAtStartup) {
      if (channelToAnnounceHundredthMember) channelToAnnounceHundredthMember.send(`We just reached ${gMember.guild.memberCount} members!`)
      hundredthMembersAtStartup = getThirdFromRight(gMember.guild.memberCount)
    }
  })

  client.on('messageCreate', async (message) => {

    const isFromAutoChannel = channelIdsToLookFor.includes(message.channel.parentId || message.channel.id)
    const isForced = message.content.toLowerCase() === ('--force')
    const isReplyRequest = !!message.reference && isForced

    if (message.author.bot || (!isFromAutoChannel && !isForced && !isReplyRequest) || !message.guild.members.cache.get(client.user.id).permissionsIn(message.channel.id).has(PermissionFlagsBits.SendMessages)) return

    const attachment = attachmentFromMessage(message, { isFromAutoChannel, isForced, isReplyRequest })

    if (!attachment) return

    if (!acceptedFileTypes.includes(attachment.name.split('.').at(-1))) {
      message.reply(`The extension type of the attachment you sent is not supported. Only \`${acceptedFileTypes.join('`, `')}\` supported.`)
      return
    }

    const requestDocument = await axios.get(attachment.url)

    if (requestDocument.status !== 200) {
      console.error(`Error while trying to get file from URL.`)
      message.reply('Sorry, I had a problem trying to get the file, can you send it again? If it still does not work then try reporting the problem to moderators.')
      return
    }

    const documentData = requestDocument.data
    
    const isSMSSC = attachment.name.endsWith('.ssc') 
    const isSM = attachment.name.endsWith('.sm')

    try {

      if (isSMSSC || isSM) {

        if (!autoReplyChannelsForSMSSC.includes(message.channel.parentId || message.channel.id) && !isForced && !isReplyRequest) return

        const chart = parseSMSSC(documentData)
        const [sucessStatus, resumeMessage] = await resumeSMSSC(chart, { skipCompare: isForced })
  
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

          if (isSM && isFromAutoChannel && message.channel.parentId === serenity_space) {
            message.reply('.SM submissions are not accepted! Download the `.ssc` template and put your charts there.')
          }
        } else {
          message.reply(resumeMessage)
        }

      } else {

        if (!autoReplyChannelsForMainlog.includes(message.channel.parentId || message.channel.id) && !isForced && !isReplyRequest) return
        if (!attachment.name.includes('MainLog')) return

        const logObj = parseLog(documentData)
        const resume = resumeLog(logObj)

        if (resume.length > 2000) {
          const contentNeededCut = resume.length > 4096
          const replyEmbed = new EmbedBuilder()
          .setColor(isForced ? '#fad0a2' : '#2f6449')
          .setTitle('Main Log Resume')
          .setDescription(contentNeededCut ? resume.substring(0, 4000) + '\n\n**The log you sent is absurdly big, content has been cut.**'.toUpperCase() : resume)
          .setFooter({ text: 'This is for main log only, do no expect this to work with other log types.' })
  
          message.reply({
            embeds: [replyEmbed]
          })
        } else {
          message.reply(resume)
        }
      }
      
      
    } catch (e) {
      console.error('Error while trying to parse document, ', e)
    }
  })

  client.on('error', e => {
    console.error(`Something Wrong Happened!\n\n${e}`)
    try {
      const channelToReportErrors = client.channels.cache.get(outfoxStaffSpam)
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Something Bad Happened - Moru Special')
        .setDescription(`\`\`\`\n${e}\n\`\`\``)

      channelToReportErrors.send({ embeds: [embed] })
    } catch (e) {
      console.error('Welp, this is unfortunate.\n\n', e)
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
