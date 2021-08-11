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
exports.run = async (message, language, { leaderboard, sheetCache }) => {
    const id = message.author.id
    const knownUsers = sheetCache.get('discord_github')
    const rows = await knownUsers.getRows()
    const rowSearch = rows.find(element => element.id === id)
    const hasPoints = rowSearch ? leaderboard.find(element => element[0] === rowSearch.github) : null

    const embed = new MessageEmbed()
    .setTitle(language.readLine('leaderboard', 'BugHunterLeaderboard'))
    .setURL('https://github.com/TeamRizu/OutFox/blob/master/leaderboard.md')
    .setColor('ADBAC7')
    .setThumbnail('https://avatars.githubusercontent.com/u/64650386?s=200&v=4')

    const leaderboardPages = () => {
        const maxLength = 1024
        const pages = ['']
        const pageIndex = new Map()
        pageIndex.set('index', 0)

        // Start at 1 because the first index is table naming.
        for (let i = 1; i < leaderboard.length; i++) {
            const [user, points, update, is] = leaderboard[i]
            const leaderboardElement = language.readLine('leaderboard', 'UserPointsField', { points, user, role: `<@&${constants.bugRole[is]}>`})
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
    
    const buttonBack = new MessageButton()
        .setCustomId('swipeback' + message.id)
        .setLabel(language.readLine('leaderboard', 'GoBack'))
        .setStyle('PRIMARY')
    const buttonBackDisabled = new MessageButton()
        .setCustomId('disabledBack' + message.id)
        .setLabel(language.readLine('leaderboard', 'GoBack'))
        .setStyle('PRIMARY')
        .setDisabled(true)
    
    const buttonNext = new MessageButton()
        .setCustomId('nextpage' + message.id)
        .setLabel(language.readLine('leaderboard', 'NextPage'))
        .setStyle('PRIMARY')
    const buttonNextDisabled = new MessageButton()
        .setCustomId('disabledNext' + message.id)
        .setLabel(language.readLine('leaderboard', 'NextPage'))
        .setStyle('PRIMARY')
        .setDisabled(true)
    const comp = new MessageActionRow().addComponents(
        buttonBack, buttonNext
    )
    const compBackDisabled = new MessageActionRow().addComponents(
        buttonBackDisabled, buttonNext
    )
    const compNextDisabled = new MessageActionRow().addComponents(
        buttonBack, buttonNextDisabled
    )
    const compBothDisabled = new MessageActionRow().addComponents(
        buttonBackDisabled, buttonNextDisabled
    )

    const setDescription = async (page = 0, msg) => {
        embed.setDescription(pages[page])
        embed.setFooter(`${language.readLine('leaderboard', 'Page')} ${page + 1}/${pages.length}`)
        
        let newComp = comp

        if (pages.length === 1) {
            newComp = compBothDisabled
        } else {
            if (page === 0) newComp = compBackDisabled
            if (page === pages.length - 1) newComp = compNextDisabled
        }

        await msg.edit({ embeds: [embed], components: [newComp] })
        return msg
    }

    const msg = await message.reply({ embeds: [embed] })
    await setDescription(0, msg)

    const backFilter = (i) => {
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
        backCollector.resetTimer({ time: 30000 })
        await setDescription(page, msg)
        i.deferUpdate()
    })

    nextCollector.on('collect', async i => {
        page = Math.min(pages.length - 1, page + 1)
        nextCollector.resetTimer({ time: 30000 })
        await setDescription(page, msg)
        i.deferUpdate()
    })

    return true
}
