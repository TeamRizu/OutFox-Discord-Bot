// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const buttonFile = require('../utils/buttons.js')
const embeds = require('../utils/embed.js')

// Variables
const { MessageActionRow, MessageSelectMenu } = Discord

/**
 *
 * @param {Discord.Message} message
 * @param {languageFile.LanguageInstance} language
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { args, archivalInstance }) => {
    const mainEmbed = embeds.embedBuilder({
        title: "Select StepMania Version",
        embed: "Select which StepMania Version you want to see themes from."
    })

    const smVersionSelects = []
    const supportedVersions = archivalInstance.supportedVersions
    const supportedVersionsName = archivalInstance.supportedVersionsName()

    for (let i = 0; i < archivalInstance.supportedVersions.length; i++) {
        smVersionSelects.push({
            value: `ofl!!${message.id}!!${supportedVersions[i]}`,
            label: supportedVersionsName[i]
        })
    }

    const versionSelector = new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId('select' + message.id)
            .setPlaceholder('Select StepMania')
            .addOptions(smVersionSelects)
            .maxValues(1)
            .minValues(1)
    )

    const mainMessage = await message.reply({ embeds: [mainEmbed], components: [versionSelector] })
    const menuCollect = mainMessage.createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 60000
    })

    menuCollect.on('collect', async (i) => {
        if (i.user.id !== message.author.id || i.guild.id !== message.guild.id || (!i.values || i.values.length === 0)) return

        i.deferUpdate()
        menuCollect.resetTimer()
    })
}
