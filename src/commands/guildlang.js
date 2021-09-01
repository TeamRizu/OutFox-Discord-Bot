// Libs
const Discord = require('discord.js')

// Files
const languageFile = require('../utils/language.js')
const messageFile = require('../listeners/message.js')

// Variables
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } =
    Discord
const cooldown = new Set()

/**
 *
 * @param {Discord.Message} message
 * @param {languageFile.LanguageInstance} language
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { Sheet, args }) => {
    const member = message.guild.members.resolve(message.author.id)

    if (!member) {
        message.reply({
            content: language.readLine('guildlang', 'UnableToVerifyMember'),
        })
        return
    }

    if (!member.permissions.has('MANAGE_GUILD')) {
        message.reply({
            content: language.readLine('generic', 'YouNeedThisPermission', {
                permission: 'MANAGE_GUILD',
            }),
        })
    }

    if (cooldown.has(message.guild.id)) {
        message.reply({
            content: language.readLine('userlang', 'UserOnCooldown'),
        })
        return
    }

    const guildLanguages = Sheet.guildLanguages
    const rows = await guildLanguages.getRows()
    const guildDefined = rows.find(
        (element) => element.guild === message.guild.id
    )

    const setLanguage = new MessageButton()
        .setCustomId(`setlang${message.id}`)
        .setLabel(language.readLine('guildlang', 'SetGuildLanguage'))
        .setStyle('PRIMARY')
    const deleteMyLanguage = new MessageButton()
        .setCustomId(`deletelang${message.id}`)
        .setLabel(language.readLine('guildlang', 'DeleteGuildLanguage'))
        .setStyle('DANGER')
    const nevermind = new MessageButton()
        .setCustomId(`nevermind${message.id}`)
        .setLabel(language.readLine('userlang', 'Nevermind'))
        .setStyle('SECONDARY')

    if (!guildDefined) {
        deleteMyLanguage.setDisabled(true)
    } else {
        setLanguage.setLabel(
            language.readLine('guildlang', 'ChangeGuildLanguage')
        )
    }

    const languages = language.readLine(
        'languages',
        undefined,
        {},
        { languageFile: language.global }
    )
    const emojis = language.readLine(
        'emojis',
        undefined,
        {},
        { languageFile: language.global }
    )
    let languageSelects = []
    for (let i = 0; i < Object.keys(languages).length; i++) {
        const langTitle = Object.keys(languages)[i]
        const langName = Object.values(languages)[i]

        if (guildDefined && guildDefined.language === langTitle) continue

        languageSelects.push({
            value: `ofl!!${message.id}!!${langTitle}`,
            label: `${emojis[langTitle]} ${langName}`,
        })
    }

    const languageSelector = new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId('select' + message.id)
            .setPlaceholder(
                language.readLine('guildlang', 'SelectGuildLanguage')
            )
            .addOptions(languageSelects)
    )

    const embed = new MessageEmbed().setTitle(
        language.readLine('userlang', 'WhatYouWantToDo')
    )

    const comp = new MessageActionRow().addComponents(
        setLanguage,
        deleteMyLanguage,
        nevermind
    )

    const languageSelectFilter = (i) => {
        if (
            i.user.id !== message.author.id ||
            !i.values ||
            i.values[0].split('!!').length !== 3 ||
            i.customId !== 'select' + message.id
        )
            return false

        const lang = i.values[0].split('!!')[2]
        if (!language.supportedLanguages.includes(lang)) return false

        return true
    }
    const waitButtonReply = (i) => {
        if (i.user.id !== message.author.id) return false
        if (
            ![
                `setlang${message.id}`,
                `deletelang${message.id}`,
                `nevermind${message.id}`,
            ].includes(i.customId)
        ) {
            return false
        }
        return true
    }

    const msg = await message.reply({ embeds: [embed], components: [comp] })

    const buttonCollector = message.channel.createMessageComponentCollector({
        filter: waitButtonReply,
        time: 30000,
    })

    buttonCollector.on('collect', async (i) => {
        i.deferUpdate()
        buttonCollector.stop()
        switch (i.customId) {
            case `setlang${message.id}`:
                msg.edit({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(
                                language.readLine(
                                    'userlang',
                                    'SetLanguageFromList'
                                )
                            )
                            .setDescription(
                                language.readLine(
                                    'guildlang',
                                    'MembersWithDefinedLanguage'
                                )
                            ),
                    ],
                    components: [languageSelector],
                })
                const selection =
                    message.channel.createMessageComponentCollector({
                        filter: languageSelectFilter,
                        time: 30000,
                    })

                selection.on('collect', async (s) => {
                    s.deferUpdate()
                    if (guildDefined) {
                        guildDefined.language = s.values[0].split('!!')[2]
                        await guildDefined.save()
                    } else {
                        await guildLanguages.addRow({
                            guild: message.guild.id,
                            language: s.values[0].split('!!')[2],
                        })
                    }
                    msg.edit({
                        embeds: [
                            new MessageEmbed().setTitle(
                                language.readLine('userlang', 'Done')
                            ),
                        ],
                        components: [],
                    })
                })
                break
            case `deletelang${message.id}`:
                const ye = new MessageButton()
                    .setCustomId(`yes${message.id}`)
                    .setLabel(language.readLine('Generic', 'Yes'))
                    .setStyle('DANGER')
                const no = new MessageButton()
                    .setCustomId(`no${message.id}`)
                    .setLabel(language.readLine('Generic', 'No'))
                    .setStyle('PRIMARY')

                msg.edit({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(
                                language.readLine(
                                    'userlang',
                                    'DeleteDefinedLanguage'
                                )
                            )
                            .setDescription(
                                language.readLine('userlang', 'AreYouSure')
                            ),
                    ],
                    components: [new MessageActionRow().addComponents(ye, no)],
                })

                const collectReply =
                    message.channel.createMessageComponentCollector({
                        filter: (i) => {
                            if (i.user.id !== message.author.id) return false

                            if (
                                ![
                                    `yes${message.id}`,
                                    `no${message.id}`,
                                ].includes(i.customId)
                            )
                                return false

                            return true
                        },
                        time: 30000,
                    })

                collectReply.on('collect', async (i) => {
                    if (i.customId === `yes${message.id}`) {
                        i.deferUpdate()
                        await guildDefined.delete()
                        msg.edit({
                            embeds: [
                                new MessageEmbed().setTitle(
                                    language.readLine('userlang', 'Deleted')
                                ),
                            ],
                            components: [],
                        })
                    } else {
                        i.deferUpdate()
                        msg.edit({
                            embeds: [
                                new MessageEmbed().setTitle(
                                    language.readLine('userlang', 'Ok')
                                ),
                            ],
                            components: [],
                        })
                    }
                    collectReply.stop()
                })
                break
            default:
                msg.edit({
                    embeds: [
                        new MessageEmbed().setTitle(
                            language.readLine('userlang', 'Ok')
                        ),
                    ],
                    components: [],
                })
                buttonCollector.stop()
                break
        }
    })

    return true
}
