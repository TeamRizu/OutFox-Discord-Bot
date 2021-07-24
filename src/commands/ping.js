// Variables
const { MessageActionRow, MessageButton } = require('discord.js')
exports.slashCommand = {
    name: 'ping',
    description: 'Tests the bot response time.'
}

exports.run = async (message) => {
    const enabledButton = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('retry')
            .setLabel('Retry')
            .setStyle('PRIMARY')
    )

    const disabledButton = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('retry')
            .setLabel('Retry')
            .setStyle('PRIMARY')
            .setDisabled(true)
    )

    const test = async (msg, interaction) => {
        const before = Date.now()
        await msg.edit({ content: 'Ping...', components: [disabledButton] })
        await interaction.update({ content: `Pong ${Date.now() - before}`, components: [] })
    }

    let before = Date.now()
    const firstMessage = await message.reply({ content: 'Ping...', components: [disabledButton] })
    const lastMessage = await firstMessage.edit({ content: `Pong ${Date.now() - before}ms`, components: [enabledButton] })
    
    const filter = i => i.customId === 'retry' && i.user.id === message.author.id
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 })
    const alreadyCollected = new Set()

    collector.on('collect', async i => {
        if (alreadyCollected.has(i.user.id)) return

        alreadyCollected.add(i.user.id)
        await test(lastMessage, i)
    })
    // const msg = await test(message, before)
}
