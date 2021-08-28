// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const constants = require('../utils/constants.js')

// Variables
const { MessageEmbed, MessageActionRow, MessageButton } = Discord

/**
 *
 * @param {Discord.Message} message
 * @param {languageFile.LanguageInstance} language
 * @param {Discord.Client} client
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { ModsSheet, args }) => {
    /*
    const modsPages = async () => {
        const maxLength = 2024
        const pages = ['']
        const rows = await ModsSheet.convertedMods.getRows()
        const pageIndex = new Map()
        pageIndex.set('index', 0)

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            const stringToAdd = `**${i + i}º** - [${row['File Name']}](${row['YT-Link']}) (${row.Author || 'Unknown Author'})\n`

            if ((pages[pageIndex.get('index')] + stringToAdd).length > maxLength) {
                const oldValue = pageIndex.get('index')
                pageIndex.delete('index')
                pageIndex.set('index', oldValue + 1)
            }

            if (typeof pages[pageIndex.get('index')] !== 'string') {
                pages[pageIndex.get('index')] = ''
            }

            pages[pageIndex.get('index')] += stringToAdd
        }

        pageIndex.delete('index')
        return pages
    }
    const pages = await modsPages()
    const embed = new MessageEmbed()
        .setDescription(pages[0])

    message.reply({ embeds: [embed] })
    */

    if (!args.argument) {
        message.reply({ content: 'Cade argumento' })
        return false
    }
    
    const file = await ModsSheet.chartInfo(args.argument[0])

    if (!file) {
        message.reply({ content: 'nem vi' })
        return false
    }

    message.reply({ content: file.name })
    return true
}
