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
 * @param {Object<string, languageFile.LanguageInstance>} languages
 * @param {Discord.Client} client
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { leaderboard, sheetCache }) => {
    const id = message.author.id
    const knownUsers = sheetCache.get('discord_github')
    const rows = await knownUsers.getRows()
    const rowSearch = rows.find(element => element.id === id)
    const hasPoints = rowSearch ? leaderboard.find(element => element[0] === rowSearch.github) : null

    const embed = new MessageEmbed()
    if (hasPoints) {
        embed.setTitle(`${hasPoints[0]} GitHub`)
        .setURL('https://github.com/' + hasPoints[0].replace('*', ''))
    }

    const leaderboardPages = () => {
        const maxLength = 1024
        const pages = ['']
        const pageIndex = new Map()
        pageIndex.set('index', 0)

        // Start at 1 because the first index is table naming.
        for (let i = 1; i < leaderboard.length; i++) {
            const [user, points, update, is] = leaderboard[i]
            const leaderboardElement = `${points} Points - ${user} (<@&${constants.bugRole[is]}>)`
            const stringToAdd = hasPoints && (user === hasPoints[0]) ? `**${leaderboardElement} <-**\n` : leaderboardElement + '\n'

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

    const pages = leaderboardPages()
    console.log(pages.length)
    const setDescription = (page = 0, msg) => {
        embed.setDescription(pages[page])
        embed.setFooter(`Page ${page + 1}`)
        msg.edit({ embeds: [embed] })
    }
    embed.setDescription(pages[0])
    
    const buttonBack = new MessageButton()
        .setCustomId('swipeback' + message.id)
        .setLabel('Go back')
        .setStyle('PRIMARY')
    // const buttonBackDisabled = buttonBack.setDisabled(true)
    
    const buttonNext = new MessageButton()
        .setCustomId('nextpage' + message.id)
        .setLabel('Next page')
        .setStyle('PRIMARY')
    // const buttonNextDisabled = buttonNext.setDisabled(true)
    const comp = new MessageActionRow().addComponents(
        buttonBack, buttonNext
    )
    
    const msg = await message.reply({ embeds: [embed], components: [comp] })

    const backFilter = (i) => {
        console.log(i.customId, ' ', 'swipeback' + message.id, '  ', `therefor, you should return ${i.customId === 'swipeback' + message.id}`)
        if (i.customId !== `swipeback${message.id}` || i.user.id !== message.author.id) {
            return false
        }

        return true
    }

    const nextFilter = (i) => {
        if (i.customId !== `nextpage${message.id}` || i.user.id !== message.author.id) {
            return false
        }

        return true

    }

    const backCollector = message.channel.createMessageComponentCollector({ filter: backFilter, time: 30000 })
    const nextCollector = message.channel.createMessageComponentCollector({ filter: nextFilter, time: 30000 })
    let page = 0

    backCollector.on('collect', async i => {
        page = Math.max(0, page - 1)
        setDescription(page, msg)
    })

    nextCollector.on('collect', async i => {
        page = Math.min(pages.length - 1, page + 1)
        setDescription(page, msg)
    })

    return true
}
