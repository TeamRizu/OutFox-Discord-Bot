// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const constants = require('../utils/constants.js')
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
exports.run = async (message, language, { Sheet, leaderboard }) => {
    const id = message.author.id
    const knownUsers = Sheet.discordgithub
    const rows = await knownUsers.getRows()
    const rowSearch = rows.find((element) => element.id === id)
    const hasPoints = rowSearch
        ? leaderboard.find((element) => element[0] === rowSearch.github)
        : null

    const embed = embeds.embedBuilder({
        title: language.readLine('leaderboard', 'BugHunterLeaderboard'),
        color: 'ADBAC7',
        thumbnail: 'https://avatars.githubusercontent.com/u/64650386?s=200&v=4',
        url: 'https://github.com/TeamRizu/OutFox/blob/master/leaderboard.md',
    })

    const leaderboardPages = new Pagination(leaderboard)
    const filter = (row, ind) => {
        if (ind === 0) return ''

        const [user, points, update, is] = row
        const leaderboardElement = language.readLine(
            'leaderboard',
            'UserPointsField',
            { points, user, role: `<@&${constants.bugRole[is]}>` }
        )
        const stringToAdd =
            hasPoints && user === hasPoints[0]
                ? `**${leaderboardElement} <-**\n`
                : leaderboardElement + '\n'

        return stringToAdd
    }
    leaderboardPages.setup(filter)

    const pages = leaderboardPages.pages

    const buttonBack = buttons.quickButton(
        'swipeback' + message.id,
        language.readLine('leaderboard', 'GoBack'),
        'PRIMARY'
    )
    const buttonBackDisabled = buttons.quickButton(
        'disabledBack' + message.id,
        language.readLine('leaderboard', 'GoBack'),
        'PRIMARY',
        { disabled: true }
    )
    const buttonNext = buttons.quickButton(
        'nextpage' + message.id,
        language.readLine('leaderboard', 'NextPage'),
        'PRIMARY'
    )
    const buttonNextDisabled = buttons.quickButton(
        'disabledNext' + message.id,
        language.readLine('leaderboard', 'NextPage'),
        'PRIMARY',
        { disabled: true }
    )

    const comp = new MessageActionRow().addComponents(buttonBack, buttonNext)
    const compBackDisabled = new MessageActionRow().addComponents(
        buttonBackDisabled,
        buttonNext
    )
    const compNextDisabled = new MessageActionRow().addComponents(
        buttonBack,
        buttonNextDisabled
    )
    const compBothDisabled = new MessageActionRow().addComponents(
        buttonBackDisabled,
        buttonNextDisabled
    )

    const setDescription = async (page = 0, msg) => {
        embed.setDescription(pages[page])
        embed.setFooter(
            `${language.readLine('leaderboard', 'Page')} ${page + 1}/${
                pages.length
            }`
        )

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
        if (
            i.customId !== `swipeback${message.id}` ||
            i.user.id !== message.author.id
        ) {
            return false
        }

        return true
    }

    const nextFilter = (i) => {
        if (
            i.customId !== `nextpage${message.id}` ||
            i.user.id !== message.author.id
        ) {
            return false
        }

        return true
    }

    const backCollector = message.channel.createMessageComponentCollector({
        filter: backFilter,
        time: 30000,
    })
    const nextCollector = message.channel.createMessageComponentCollector({
        filter: nextFilter,
        time: 30000,
    })
    let page = 0

    backCollector.on('collect', async (i) => {
        page = Math.max(0, page - 1)
        backCollector.resetTimer({ time: 30000 })
        await setDescription(page, msg)
        i.deferUpdate()
    })

    nextCollector.on('collect', async (i) => {
        page = Math.min(pages.length - 1, page + 1)
        nextCollector.resetTimer({ time: 30000 })
        await setDescription(page, msg)
        i.deferUpdate()
    })

    return true
}
