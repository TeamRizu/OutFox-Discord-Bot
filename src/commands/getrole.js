// Libs
const Discord = require('discord.js')
const NodeCache = require('node-cache')

// Files
const messageFile = require('../listeners/message.js')
const languageFile = require('../utils/language.js')
const buttonFile = require('../utils/buttons.js')
const constants = require('../utils/constants.js')
const embeds = require('../utils/embed.js')

// Variables
const { MessageActionRow, MessageSelectMenu } = Discord
const fileCache = new NodeCache({ stdTTL: 180 })
fileCache.set('history', { arr: [] }, 20000)
/**
 *
 * @param {Discord.Message} message
 * @param {languageFile.LanguageInstance} language
 * @param {messageFile.OptionalParams} param3
 */
exports.run = async (message, language, { client, args }) => {
    if (message.guild.id !== process.env.DEVSERVER) return false

    const outfoxServer = message.guild

    if (!(await outfoxServer.members.fetch(client.user.id)).permissions.has('MANAGE_ROLES')) {
        message.reply("I'm missing MANAGE_ROLES permission.")
        return;
    }

    const member = await outfoxServer.members.fetch(message.author.id)

    if (!member) return false

    if (args.argument) {
        let role = args.argument.join(' ').toLowerCase()

        if (!Object.keys(constants.roleForMembers).includes(role)) {
            message.reply('That role does not exist.')
            return false
        }

        role = await outfoxServer.roles.fetch(constants.roleForMembers[role])
        
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

        const adding = await message.reply({ content: 'Adding role...' })
        await member.roles.add(role.id).catch((e) => {
            console.error(e)
            message.reply('Something happened while trying to give you the role.')
            return false
        })
        await adding.edit({ content: 'Done.' })

        return true
    }

    const embed = embeds.embedBuilder({
        title: "Roles Setup",
        description: "This setup will help you define free roles for your profile, press the confirm button to continue or press cancel.\n\nSelecting roles you already have will remove them."
    })

    const mainMessage = await message.reply({ embeds: [embed] })

    const { button: confirmButton, collector: confirmCollector } = buttonFile.quickBetterButton(message, `confirm${message.id}`, 'Confirm', 'PRIMARY')
    const { button: cancelButton, collector: cancelCollector } = buttonFile.quickBetterButton(message, `cancel${message.id}`, 'Cancel', 'DANGER')

    mainMessage.edit({ components: [ new MessageActionRow().addComponents(confirmButton, cancelButton) ] })
    cancelCollector.on('collect', async (i) => {
        cancelCollector.stop()
        confirmCollector.stop()
        i.deferUpdate()
        mainMessage.edit({ components: [] })
        message.reply('Ok!')
    })

    const setupArrays = () => {
        const objToReturn = {}

        for (let i = 0; i < Object.keys(constants.roleForMembersCategories).length; i++) {
            const masterKey = Object.keys(constants.roleForMembersCategories)[i]
            
            if (!objToReturn[masterKey]) {
                objToReturn[masterKey] = []
            }

            for (let j = 0; j < Object.keys(constants.roleForMembersCategories[masterKey]).length; j++) {
                const roleName = Object.keys(constants.roleForMembersCategories[masterKey])[j]
                const roleID = Object.values(constants.roleForMembersCategories[masterKey])[j]
                objToReturn[masterKey].push({
                    value: `ofl!!${message.id}!!${roleName.toLowerCase()}`,
                    label: roleName
                })

                if (member.roles.cache.has(roleID)) {
                    objToReturn[masterKey][objToReturn[masterKey].length - 1].description = 'Already Owned!'
                }
            }
        }

        return objToReturn
    }

    const selectMenus = setupArrays()
    const embedMenu = (category) => {
        const embed = embeds.embedBuilder({ title: constants.categoriesTitles[category], description: constants.categoriesDescription[category] })
        return embed
    }

    const { button: skipButton, collector: skipCollector } = buttonFile.quickBetterButton(message, `skip${message.id}`, "Don't want any of those options", 'DANGER', { timer: 18000 })

    const updateMessage = async (msg, content, embed, menu) => {
        await msg.edit({ content, embeds: [embed], components: [ new MessageActionRow().addComponents(menu), new MessageActionRow().addComponents(skipButton)] })
    }

    const optionsSelectFilter = (i) => {
        if (i.split('!!').length !== 3) return null

        const given = i.split('!!')

        return {
            prefix: given[0],
            id: given[1],
            role: given[2]
        }
    }

    const menuObject = (category) => {
        const categoryOptions = selectMenus[category]

        return new MessageSelectMenu()
            .setCustomId(`select${message.id}`)
            .setPlaceholder('Select here')
            .setMaxValues(categoryOptions.length)
            .addOptions(categoryOptions)
    }

    /**
     * 
     * @param {string[]} history 
     * @returns {string}
     */
    const historyString = (history) => {
        let finalStr = ''
        console.log(history)
        for (let i = 0; i < history.length; i++) {
            const added = history[i].startsWith('A')
            const role = history[i].substring(1)
 
            finalStr += added ? `- Added <@&${role}>` : `- Removed <@&${role}>`
            if (i !== history.length - 1) finalStr += '\n'
        }

        return finalStr || 'No roles were added or removed.'
    }

    confirmCollector.on('collect', async (i) => {
        cancelCollector.stop()
        confirmCollector.stop()
        i.deferUpdate()
        
        const categories = ['specialRoles', 'regionRoles', 'osRoles', 'hardwareRoles', 'freeRoles', 'gamemodeRoles']
        let index = 0

        await mainMessage.edit({ content: null, embeds: [embedMenu('specialRoles')], components: [ new MessageActionRow().addComponents(menuObject('specialRoles')), new MessageActionRow().addComponents(skipButton) ] })
        
        skipCollector.on('collect', async (i) => {
            i.deferUpdate()
            skipCollector.resetTimer()

            // FIXME: This will not keep track of items added into the history array, making the command crash if the last page is skipped.
            if (index === 5) {
                const history = await fileCache.get('history')
                await mainMessage.edit({ embeds: [embeds.embedBuilder({ title: 'Setup done!', description: historyString(history.arr) })], components: [] })
            } else {
                index++
                await updateMessage(mainMessage, null, embedMenu(categories[index]), menuObject(categories[index]))
            }
        })

        const menuCollect = mainMessage.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 60000 })
        
        menuCollect.on('collect', async (i) => {
            if (i.user.id !== message.author.id || i.guild.id !== message.guild.id || (!i.values || i.values.length === 0)) return

            i.deferUpdate()
            menuCollect.resetTimer()
            for (let ind = 0; ind < i.values.length; ind++) {
                const given = optionsSelectFilter(i.values[ind])
                let role = constants.roleForMembers[given.role]

                if (!role) continue

                role = await outfoxServer.roles.fetch(role)

                if (!role) continue

                const oldValue = await fileCache.get('history')
                if (member.roles.cache.find(rol => rol.id === role.id)) {
                    await member.roles.remove(role.id)
                    fileCache.del('history')
                    fileCache.set('history', { arr: oldValue.arr.concat(`R${role.id}`) })
                } else {
                    await member.roles.add(role.id)
                    fileCache.del('history')
                    fileCache.set('history', { arr: oldValue.arr.concat(`A${role.id}`) })
                }
            }

            if (index === 5) {
                const history = await fileCache.get('history')
                mainMessage.edit({ embeds: [embeds.embedBuilder({ title: 'Setup done!', description: historyString(history.arr) })], components: [] })
            } else {
                index++
                console.log(`Requesting ${categories[index]}`)
                updateMessage(mainMessage, null, embedMenu(categories[index]), menuObject(categories[index]))
            }
        })
    })
}
