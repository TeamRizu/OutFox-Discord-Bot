// Libs
const Discord = require('discord.js')
const nodeuri = require('node-uri')
const Vibrant = require('node-vibrant')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const pagination = require('../utils/pagination.js')
const embeds = require('../utils/embed.js')
const buttons = require('../utils/buttons.js')

// Variables
const { MessageActionRow } = Discord
const Pagination = pagination.Pagination

/**
 *
 * @param {Discord.Message} message
 * @param {languageFile.LanguageInstance} language
 * @param {Discord.Client} client
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { ModsSheet, args }) => {
    if (!args.argument) {
        const modsPages = new Pagination(
            await ModsSheet.convertedMods.getRows()
        )
        const filter = (row, ind) => {
            if (!row['File Name']) return false
            return `**${ind + 1}º** - [${row['File Name']}](${
                row['YT-Link']
            }) (${row.Author || 'Unknown Author'})\n`
        }
        modsPages.setup(filter)
        let currentPage = 0
        const embed = embeds.embedBuilder({
            title: 'Converted Mods',
            footer: `Page ${currentPage + 1} / ${
                modsPages.pages.length
            } - SM5 Conversions by MrThatKid.`,
            description: modsPages.getPage(currentPage),
        })

        const mainMessage = await message.reply({ embeds: [embed] })

        const updateEmbed = async () => {
            embed.setDescription(modsPages.getPage(currentPage))
            embed.setFooter(
                `Page ${currentPage + 1} / ${
                    modsPages.pages.length
                } - SM5 Conversions by MrThatKid.`
            )
            await mainMessage.edit({ embeds: [embed] })

            return embed
        }

        const backBetterButton = buttons.quickBetterButton(
            message,
            `${'backpage' + message.id}`,
            'Go back',
            'PRIMARY'
        )
        const backButton = backBetterButton.button
        const backCollector = backBetterButton.collector

        const nextBetterButton = buttons.quickBetterButton(
            message,
            `${'nextpage' + message.id}`,
            'Next page',
            'PRIMARY'
        )
        const nextButton = nextBetterButton.button
        const nextCollector = nextBetterButton.collector

        backCollector.on('collect', async (i) => {
            if (!i.isButton) return

            backCollector.resetTimer()
            i.deferUpdate()
            if (0 > currentPage - 1) return

            currentPage--
            await updateEmbed()
        })

        nextCollector.on('collect', async (i) => {
            if (!i.isButton) return

            nextCollector.resetTimer()
            i.deferUpdate()
            if (currentPage + 1 > modsPages.pages.length - 1) return

            currentPage++
            await updateEmbed()
        })

        const comp = new MessageActionRow().addComponents(
            backButton,
            nextButton
        )

        mainMessage.edit({ components: [comp] })
    } else {
        const file = await ModsSheet.chartInfo(args.argument.join(' '))

        if (!file) {
            message.reply({ content: 'File not found.' })
            return false
        }

        const explanation = {
            converted:
                'This file is already converted and you can download it.',
            requested: 'This file has been requested by someone.',
            impossible:
                "This file has been requested but it's not possible to convert yet.",
            forbbiden: 'This file will not be converted.',
        }

        const embed = embeds.embedBuilder({
            title: `${file.name}`,
            footer: explanation[file.foundIn],
        })

        if (file.video) {

            // FIXME: "URIError: uri scheme is required" when giving "e_n_o" as argument 
            if (nodeuri.checkHttpsURL(file.video)) {
                embed.setURL(file.video)

                const results = file.video.match('[\\?&]v=([^&#]*)')
                const secondResult = file.video.substring(file.video.length - 11)
                let videoID = (results === null) ? file.video : results[1]
                // This solves this type of link https://youtu.be/oMa-fqnCVzY
                if (videoID === file.video && secondResult.length === 11) videoID = secondResult

                if (videoID && videoID.length === 11 && nodeuri.checkHttpsURL(`https://img.youtube.com/vi/${videoID}/0.jpg`)) {
                    embed.setImage(`https://img.youtube.com/vi/${videoID}/0.jpg`)

                    const vibrantColor = new Map()
                    const colorObj = await Vibrant.from(`https://img.youtube.com/vi/${videoID}/0.jpg`).getPalette((err, palette) => {
                        if (err) {
                            console.log(err)
                            return false
                        }

                        const rgb = palette.Vibrant._rgb
                        const componentToHex = (c) => { // Credits: https://stackoverflow.com/a/5624139
                            let hex = c.toString(16)
                            return hex.length == 1 ? '0' + hex : hex
                        }
                        
                        vibrantColor.set('value', `#${componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2])}`)
                        return true
                    })
                    
                    if (colorObj) embed.setColor(vibrantColor.get('value'))
                }
            } else {
                embed.addField('Video', file.video)
            }
        }
        if (file.pack) embed.addField('Pack', file.pack, true)
        if (file.author) embed.addField('Author', file.author, true)
        switch (file.foundIn) {
            case 'converted':
                embed.addField('Version', file.version, true)
                break
            case 'requested':
            case 'impossible':
                embed.addField('Requested by', file.requestedBy, true)
                embed.addField('Status', file.status)
                break
            case 'forbidden':
                embed.addField('Type', file.type, true)
                if (file.reason) embed.addField('Reason', file.reason, true)
                break
            default:
                break
        }

        message.reply({ embeds: [embed] })
    }

    return true
}
