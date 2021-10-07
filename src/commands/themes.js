// Libs
const Discord = require('discord.js')
const NodeCache = require('node-cache')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const buttonFile = require('../utils/buttons.js')
const embeds = require('../utils/embed.js')

// Variables
const { MessageActionRow, MessageSelectMenu } = Discord
const fileCache = new NodeCache({ stdTTL: 180 })

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
    const supportedVersionsName = archivalInstance.supportedVersionsName

    for (let i = 0; i < supportedVersions.length; i++) {
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
            .setMaxValues(1)
            .setMinValues(1)
    )

    const mainMessage = await message.reply({ embeds: [mainEmbed], components: [versionSelector] })
    const menuCollect = mainMessage.createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 60000
    })

    const optionsSelectFilter = (i) => {
        if (i.split('!!').length !== 3) return null

        const given = i.split('!!')

        return {
            prefix: given[0],
            id: given[1],
            arg: given[2]
        }
    }

    menuCollect.on('collect', async (i) => {
        console.log(i)
        if (i.user.id !== message.author.id || i.guild.id !== message.guild.id || (!i.values || i.values.length === 0)) return

        i.deferUpdate()
        menuCollect.resetTimer()
        const { arg } = optionsSelectFilter(i.values[0])

        if (fileCache.has('version')) {

            const theme = archivalInstance.themeFromVersion(fileCache.get('version'), arg)
            const emb = embeds.embedBuilder({
                title: theme.Name,
                description: `Information about ${theme.Name} for ${fileCache.get('version')}`
            })

            if (theme.Date) emb.addField('Creation Date', theme.Date)
            if (theme.Author) emb.addField('Author', theme.Author)
            if (theme.Version) emb.addField('Version', theme.Version)
            mainMessage.edit({ embeds: [emb], components: [] })
            fileCache.del('version')
            menuCollect.stop()
            return true
        }

        const themesSelect = []
        const themes = archivalInstance.themesForVersion(arg)
        for (let ind = 0; ind < themes.length; ind++) {
            themesSelect.push({
                value: `ofl!!${message.id}!!${themes[ind]}`,
                label: themes[ind]
            })
        }

        const themeSelector = new MessageActionRow().addComponents(
            new MessageSelectMenu()
            .setCustomId('select' + message.id)
            .setPlaceholder('Select StepMania')
            .addOptions(themesSelect)
            .setMaxValues(1)
            .setMinValues(1)
        )
        await mainMessage.edit({ embeds: [embeds.embedBuilder({
            title: 'Select Theme',
            description: 'Now that you have select the version, select which theme you wish to look.'
        })], components: [themeSelector] })
        fileCache.set('version', arg, 60000)
    })
}
