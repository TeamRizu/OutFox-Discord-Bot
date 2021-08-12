// Libs
const Discord = require('discord.js')

// Files
const languageFile = require('../utils/language.js')
const messageFile = require('../listeners/message.js')

// Variables
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = Discord
const cooldown = new Set()

/**
 * 
 * @param {Discord.Message} message 
 * @param {Object<string, languageFile.LanguageInstance>} languages
 * @param {Discord.Client} client
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { Sheet, args }) => {

    const member = message.guild.members.resolve(message.author.id)

    if (!member) {
        message.reply({ content: language.readLine('guildlang', 'UnableToVerifyMember') })
        return
    }

    if (!member.permissions.has('MANAGE_GUILD')) {
        message.reply(
            {
                content: language.readLine('generic', 'YouNeedThisPermission',
                {
                    permission: 'MANAGE_GUILD'
                })
            }
        )
    }

    if (cooldown.has(message.guild.id)) {
        message.reply({ content: language.readLine('userlang', 'UserOnCooldown') })
        return
    }

    const guildLanguages = Sheet.doc.sheetsByTitle['guild_languages']
    const rows = await guildLanguages.getRows()
    const guildDefined = rows.find(element => element.guild === message.guild.id)

    const setLanguage = new MessageButton()
        .setCustomId('setlang' + message.id)
        .setLabel('Set guild language')
        .setStyle('PRIMARY')
    const deleteMyLanguage = new MessageButton()
        .setCustomId('deletelang' + message.id)
        .setLabel('Delete guild language')
        .setStyle('DANGER')
    const nevermind = new MessageButton()
        .setCustomId('nevermind' + message.id)
        .setLabel('nevermind')
        .setStyle('SECONDARY')

    if (!guildDefined) {
        deleteMyLanguage.setDisabled(true)
    } else {
        setLanguage.setLabel('Change guild language')
    }

    const languages = language.readLine('languages', undefined, {}, { languageFile: language.global })
    const emojis = language.readLine('emojis', undefined, {}, { languageFile: language.global })
    let languageSelects = []
    for (let i = 0; i < Object.keys(languages).length; i++) {
        const langTitle = Object.keys(languages)[i]
        const langName = Object.values(languages)[i]

        if (guildDefined && guildDefined.language === langTitle) continue

        languageSelects.push({
            value: `ofl!!${message.id}!!${langTitle}`,
            label: `${emojis[langTitle]} ${langName}`
        })
    }

    const languageSelector = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select' + message.id)
            .setPlaceholder('Select guild Language')
            .addOptions(languageSelects)
    )

    const embed = new MessageEmbed()
    .setTitle('What you want to do?')

    const comp = new MessageActionRow().addComponents(setLanguage, deleteMyLanguage, nevermind)

    const languageSelectFilter = (i) => {
        if (i.user.id !== message.author.id || !i.values || i.values[0].split('!!').length !== 3 || i.customId !== 'select' + message.id) return false

        const lang = i.values[0].split('!!')[2]
        if (!language.supportedLanguages.includes(lang)) return false

        return true
    }
    const waitButtonReply = (i) => {
        if (i.user.id !== message.author.id) return false
        if (![`setlang${message.id}`, `deletelang${message.id}`, `nevermind${message.id}`].includes(i.customId)) {
            return false
        }
        return true
    }

    const msg = await message.reply({ embeds: [embed], components: [comp] })

    const buttonCollector = message.channel.createMessageComponentCollector({ filter: waitButtonReply, time: 30000 })

    buttonCollector.on('collect', async i => {
        i.deferUpdate()
        buttonCollector.stop()
        switch (i.customId) {
            case `setlang${message.id}`:
                msg.edit({ embeds: [new MessageEmbed().setTitle('Select language from list').setDescription('Members who define their own language will ignore the guild language!')], components: [languageSelector]})
                const selection = message.channel.createMessageComponentCollector({ filter: languageSelectFilter, time: 30000 })

                selection.on('collect', async s => {
                    s.deferUpdate()
                    if (guildDefined) {
                        guildDefined.language = s.values[0].split('!!')[2]
                        await guildDefined.save()
                    } else {
                        await guildLanguages.addRow({ guild: message.guild.id, language: s.values[0].split('!!')[2] })
                    }
                    msg.edit({ embeds: [new MessageEmbed().setTitle('Done!')], components: []})
                })
            break
            case `deletelang${message.id}`:
                const ye = new MessageButton()
                    .setCustomId('yes' + message.id)
                    .setLabel('Yes')
                    .setStyle('DANGER')
                const no = new MessageButton()
                    .setCustomId('no' + message.id)
                    .setLabel('No')
                    .setStyle('PRIMARY')

                msg.edit({
                    embeds: [new MessageEmbed().setTitle('Delete defined language').setDescription('Are you sure?')], 
                    components: [new MessageActionRow().addComponents(ye, no)]
                })

                const collectReply = message.channel.createMessageComponentCollector({
                    filter: (i) => {
                        if (i.user.id !== message.author.id) return false

                        if (![`yes${message.id}`, `no${message.id}`].includes(i.customId)) return false

                        return true
                    },
                    time: 30000
                })

                collectReply.on('collect', async i => {
                    if (i.customId === `yes${message.id}`) {
                        i.deferUpdate()
                        await guildDefined.delete()
                        msg.edit({ embeds: [new MessageEmbed().setTitle('Deleted!')], components: [] })
                    } else {
                        i.deferUpdate()
                        msg.edit({ embeds: [new MessageEmbed().setTitle('Ok')], components: [] })
                    }
                    collectReply.stop()
                })
            break
            default:
                msg.edit({ embeds: [new MessageEmbed().setTitle('Ok')], components: [] })
                buttonCollector.stop()
            break
        }
    })

    return true
    /*
    const lang = args.argument[0].toLowerCase()

    if (!language.supportedLanguages.includes(lang)) {
        message.reply(
            { 
                content: language.readLine('userlang', 'LanguageNotSupported') + '\n```\n' + language.supportedLanguages.join('\n') + '```' 
            }
        )
        return
    }

    

    if (guildDefined) {
        if (guildDefined.language === lang) {
            message.reply({
                content: language.readLine('userlang', 'LanguageAlreadyDefined')
            })
            return
        }

        guildDefined.language = lang
        await guildDefined.save()
        message.reply(
            {
                content: language.readLine('userlang', 'LanguageUpdated')
            }
        )
        cooldown.add(message.guild.id)
        setTimeout(() => {
            cooldown.delete(message.guild.id)
        }, 18000)
    } else {
        guildLanguages.addRow({ guild: message.guild.id, language: lang })
        message.reply(
            {
                content: language.readLine('userlang', 'LanguageImplemented')
            }
        )
        cooldown.add(message.guild.id)
        setTimeout(() => {
            cooldown.delete(message.guild.id)
        }, 18000)
    }

    return true
    */
}