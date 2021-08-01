// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')

// Variables
const { MessageEmbed } = Discord

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

    if (!rowSearch) return false

    const hasPoints = leaderboard.find(element => element[0] === rowSearch.github)

    if (!hasPoints) return false

    const embed = new MessageEmbed()
    .setTitle(hasPoints[0])
    // .setURL('https://github.com/' + hasPoints[0])

    const leaderboardMin = 0
    const leaderboardMax = leaderboard.length
    const currentIndex = leaderboard.findIndex(element => element[0] === hasPoints[0])

    const createBiasedMiddleArray = () => {
        const arr = []
        const minusTwo = (currentIndex - 2) < leaderboardMin
        const minusOne = (currentIndex - 1) < leaderboardMin
        const plusTwo = (currentIndex + 2) > leaderboardMax
        const plusOne = (currentIndex + 1) > leaderboardMax

        if (!minusTwo) {
            const tempUser1 = leaderboard[currentIndex - 2]
            const tempUser2 = leaderboard[currentIndex - 1]

            arr.push(`${tempUser1[0]} - ${tempUser1[1]} ${language.readLine('leaderboard', 'Points')}`)
            arr.push(`${tempUser2[0]} - ${tempUser2[1]} ${language.readLine('leaderboard', 'Points')}`)
        } else if (!minusOne) {
            const tempUser = leaderboard[currentIndex - 1]
            arr.push(`${tempUser[0]} - ${tempUser[1]} ${language.readLine('leaderboard', 'Points')}`)
        }

        arr.push(`**${hasPoints[0]} - ${hasPoints[1]} ${language.readLine('leaderboard', 'Points')}**`)

        if (!plusTwo) {
            const tempUser1 = leaderboard[currentIndex + 2]
            const tempUser2 = leaderboard[currentIndex + 1]

            arr.push(`${tempUser2[0]} - ${tempUser2[1]} ${language.readLine('leaderboard', 'Points')}`)
            arr.push(`${tempUser1[0]} - ${tempUser1[1]} ${language.readLine('leaderboard', 'Points')}`)
        } else if (!plusOne) {
            const tempUser = leaderboard[currentIndex + 1]
            arr.push(`${tempUser[0]} - ${tempUser[1]} ${language.readLine('leaderboard', 'Points')}`)
        }

        return arr.join('\n')
    }

    embed.setDescription(createBiasedMiddleArray())

    message.channel.send({ embeds: [embed] })
}
