// Libs
const Discord = require('discord.js')
const nodeuri = require('node-uri')
const Vibrant = require('node-vibrant')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const embeds = require('../utils/embed.js')
const leaderboardMessage = require('../utils/leaderboardMessage.js')

/**
 *
 * @param {Discord.Message} message
 * @param {languageFile.LanguageInstance} language
 * @param {Discord.Client} client
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { ModsSheet, args }) => {
    if (!args.argument) {
        const botMessage = await message.channel.send('Interact with the menu bellow')
        const modsPages = new leaderboardMessage.LeaderboardMessage(botMessage, message, language)
        const rows = await ModsSheet.convertedMods.getRows()
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]

            if (!row['File Name']) continue

            modsPages.addElement(row)
        }
        modsPages.formatElement = (row, ind) => {
            return `**${ind}º** - [${row['File Name']}](${
                row['YT-Link']
            }) (${row.Author || 'Unknown Author'})`
        }
        modsPages.updateMessage('init')

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
            forbidden: 'This file will not be converted.',
        }

        const embed = embeds.embedBuilder({
            title: `${file.name}`,
            footer: explanation[file.foundIn],
        })

        if (file.video && ['youtube', 'youtu.be'].some(e => file.video.includes(e))) {

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
