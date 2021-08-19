// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const buttonFile = require('../utils/buttons.js')

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
 * @param {languageFile.LanguageInstance} language
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language) => {
    const enabledButton = new MessageActionRow().addComponents(
        buttonFile.quickButton(`retry${message.id}`, language.readLine('ping', 'Retry'), 'PRIMARY')
    )

    const disabledButton = new MessageActionRow().addComponents(
        buttonFile.quickButton(`retry${message.id}`, language.readLine('ping', 'Retry'), 'PRIMARY', { disabled: true })
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
    const filter = i => i.customId === (`retry${message.id}`) && i.user.id === message.author.id
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 })
    const alreadyCollected = new Set()

    collector.on('collect', async i => {
        if (alreadyCollected.has(i.user.id)) return

        alreadyCollected.add(i.user.id)
        await test(lastMessage, i)
        collector.stop()
    })

    return true
}
