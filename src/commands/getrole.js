// Libs
const Discord = require('discord.js')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const buttonFile = require('../utils/buttons.js')
const constants = require('../utils/constants.js')
const embeds = require('../utils/embed.js')

// Variables
const { MessageActionRow } = Discord

/**
 *
 * @param {Discord.Message} message
 * @param {languageFile.LanguageInstance} language
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { client, args }) => {
    if (message.guild.id !== process.env.DEVSERVER) return false

    const outfoxServer = message.guild

    if (!outfoxServer.permissionsFor(client.user.id)?.has('MANAGE_ROLES')) {
        message.reply("I'm missing MANAGE_ROLES permission.")
        return;
    }

    const member = await outfoxServer.members.fetch(message.author.id)

    if (!member) return false

    if (args.argument) {
        let role = args.argument[0].toLowerCase()

        if (!Object.keys(constants.roleForMembers).includes(role)) {
            message.reply('That role does not exist.')
            return false
        }

        role = outfoxServer.roles.fetch(constants.roleForMembers[role])
        
        if (!role) {
            message.reply('Failed to fetch role.')
            return false
        }

        if (member.roles.cache.has(role.id)) {
            message.reply('You already have that role.')
            return false
        }

        if (role.position > (await outfoxServer.members.fetch(client.id))?.roles?.highest?.position) {
            message.reply('That role is somehow above my highest role.')
            return false
        }

        member.roles.add(role.id).catch((e) => {
            console.error(e)
            message.reply('Something happened while trying to give you the role.')
            return false
        })

        return true
    }

    const embed = embeds.embedBuilder({
        title: "Roles Setup",
        description: "This setup will help you define free roles for your profile, press the confirm button to continue or press cancel."
    })

    const mainMessage = message.reply({ embeds: [embed] })

    const { collector: confirmCollector } = buttonFile.quickBetterButton(message, `confirm${message.id}`, 'Confirm', 'PRIMARY')
    const { collector: cancelCollector } = buttonFile.quickBetterButton(message, `cancel${message.id}`, 'Cancel', 'DANGER')
    
    cancelCollector.on('collect', async (i) => {
        cancelCollector.stop()
        confirmCollector.stop()
        i.deferUpdate()
        message.reply('Ok!')
    })

    confirmCollector.on('collect', async (i) => {
        cancelCollector.stop()
        confirmCollector.stop()
        i.deferUpdate()
    })
}
