// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')

// Variables
const { MessageActionRow, MessageButton } = Discord
/*
exports.slashCommand = {
    name: 'ping',
    description: 'Tests the bot response time.'
}
*/

/**
 * 
 * @param {Discord.Message} message 
 * @param {Object<string, languageFile.LanguageInstance>} languages
 * @param {Discord.Client} client
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language) => {
    const enabledButton = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('retry' + message.id)
            .setLabel(language.readLine('ping', 'Retry'))
            .setStyle('PRIMARY')
    )

    const disabledButton = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('retry' + message.id)
            .setLabel(language.readLine('ping', 'Retry'))
            .setStyle('PRIMARY')
            .setDisabled(true)
    )

    const test = async (msg, interaction) => {
        const before = Date.now()
        await msg.edit({ content: language.readLine('ping', 'Ping'), components: [disabledButton] })
        await interaction.update(
            {
                content: language.readLine('ping', 'Pong', { ms: Date.now() - before }),
                components: []
            }
        )
    }

    let before = Date.now()
    const firstMessage = await message.reply({ content: language.readLine('ping', 'Ping'), components: [disabledButton] })
    const lastMessage = await firstMessage.edit(
        { 
            content: language.readLine('ping', 'Pong', { ms: Date.now() - before }),
            components: [enabledButton] 
        }
    )

    const filter = i => i.customId === ('retry' + message.id) && i.user.id === message.author.id
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 })
    const alreadyCollected = new Set()

    collector.on('collect', async i => {
        if (alreadyCollected.has(i.user.id)) return

        alreadyCollected.add(i.user.id)
        await test(lastMessage, i)
        collector.stop('Only one interaction allowed.')
    })

    return true
    // const msg = await test(message, before)
}
