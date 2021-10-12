// Libs
const Discord = require('discord.js')

// Files
const buttons = require('./buttons.js')
const embeds = require('./embed.js')

// Variables
const { MessageActionRow, MessageSelectMenu } = Discord
exports.LeaderboardMessage = class {
    constructor(message, userMessage, language) {
        this.elements = []
        this.page = 0
        this.elementsPerPage = 15
        this.charsPerElement = 80
        this.charsPerPage = 1024
        this.supportLookUp = false // If enabled, the message author can type the number of the element to read more about it. Only supported for Object elements.
        this.lookingUp = false
        this.menuSelectPlaceholder = 'Look up element'
        this.leaderboardTitle = 'Checkout cool stuff'
        this.idleTime = 120000
        this.message = message
        this.userMessage = userMessage
        this.language = language
        this.formatElement = (e, i) => {

            if (typeof e === 'object') {
                return i ? `${i}° ${e.description}` : (e.description || 'UNKNOWN_OBJECT_ELEMENT_DESCRIPTION')
            }

            return i ? `${i}° ${e}` : (e || 'UNKNOWN_ELEMENT')
        }
        this.lookUpFunc = (element) => {
            return embeds.embedBuilder(element)
        }
    }

    addElement(element) {
        if (typeof element === 'string' || typeof element === 'object') {

            if (this.elements.length !== 0 && !this.elements.every(e => typeof e === typeof element)) {
                console.warn(`Trying to add different element type to an array already made out of `, typeof element)
                return false
            }

            if (typeof element === 'string' && element.length > this.charsPerElement) {
                console.warn('Element is longer than allowed character limit. Limit = ', this.charsPerElement, ', Given = ', element.length)
                return false
            }

            this.elements.push(element)
            return true
        }

        console.warn('Tried to add bad element to LeaderboardMessage, ', element)
        return false
    }

    get pages() {
        const pageList = []
        const individualElements = [[]]
        let pageContent = ''

        for (let i = 0; i < this.elements.length; i++) {
            const currentElement = this.elements[i]
            const elementString = this.formatElement(currentElement, i + 1)

            // If the addition of the element will make the page bigger than allowed, then create a new page.
            if ((pageContent.length + elementString.length) > this.charsPerPage) {
                pageList.push(pageContent)
                pageContent = ''
            }

            const individualPageIndex = pageList.length > 0 ? pageList.length - 1 : pageList.length
            if (individualElements[individualPageIndex] === undefined) {
                individualElements[individualPageIndex] = []
            }
            individualElements[individualPageIndex].push(typeof currentElement === 'object' ? currentElement : elementString)
            pageContent += `\n${elementString}`

            // If we reach the limit of elements per page, add the current content to the page list.
            if (i !== 0 && (i % this.elementsPerPage) === 0) {
                pageList.push(pageContent)
                pageContent = ''
                continue // We need this here to the condition bellow doesn't run if this runs, which would add 2 pages.
            }

            if (i === (this.elements.length - 1)) {
                pageList.push(pageContent)
            }
        }

        return {
            pageList,
            individualElements
        }
    }

    /**
     * 
     * @param {'pageswitch'|'stoplooking'|'lookup'|'init'} reason 
     * @param {any} args 
     */
    async updateMessage(reason, args) {
        switch (reason) {
            case 'pageswitch':
            case 'stoplooking':
            case 'init':
                await this.message.edit({
                    embeds: [
                        embeds.embedBuilder({
                            title: this.leaderboardTitle,
                            description: this.pages.pageList[this.page],
                            footer: `Page ${this.page + 1}/${this.pages.pageList.length}`
                        })
                    ],
                    components: this.pageComponents
                })
            break
            default: // lookup
                const embed = await this.lookUpFunc( this.pages.individualElements[args[0]][args[1]] )
                await this.message.edit({
                    // The default lookUpFunc is not async but one defined by the user is.
                    embeds: [embed],
                    components: this.pageComponents
                })
            break
        }
    }

    get pageComponents() {

        // if (this.lookingUp) {
        //     return []
        // }
        if (this.lookingUp) {
            const { button: stopLookingButton, collector: stopLookingCollector } = buttons.quickBetterButton(
                this.message,
                'stoplooking' + this.message.id,
                this.language.readLine('generic', 'lookUpBack'),
                'PRIMARY',
                { timer: this.idleTime }
            )

            stopLookingCollector.on('collect', async i => {
                try {
                    if (i.user.id !== this.userMessage.author.id) return
                    await i.deferReply()
                    await this.updateMessage('stoplooking')
                    this.lookingUp = false
                } catch (e) {
                    console.warn(`Interaction said to be unknown, ignoring...`)
                }
            })

            return [new MessageActionRow().addComponents(stopLookingButton)]
        }

        const pageCount = this.pages.pageList.length - 1
        const isNextPossible = !((this.page + 1) > pageCount)
        const isBackPossible = !((this.page - 1) < 0)

        const { button: backButton, collector: backCollector } = buttons.quickBetterButton(
            this.userMessage,
            'back' + this.message.id,
            this.language.readLine('leaderboard', 'GoBack'),
            'PRIMARY',
            { timer: this.idleTime }
        )

        const { button: nextButton, collector: nextCollector } = buttons.quickBetterButton(
            this.userMessage,
            'next' + this.message.id,
            this.language.readLine('leaderboard', 'NextPage'),
            'PRIMARY',
            { timer: this.idleTime }
        )

        if (!isNextPossible) {
            nextButton.setDisabled(true)
        } else {
            nextButton.setDisabled(false)
            nextCollector.on('collect', async i => {
                try {
                    if (i.user.id !== this.userMessage.author.id) return
                    i.deferUpdate()
                    this.page++
                    await this.updateMessage('pageswitch')
                } catch (e) {
                    console.warn(`Interaction said to be unknown, ignoring...`)
                }
            })
        }

        if (!isBackPossible) {
            backButton.setDisabled(true)
        } else {
            backButton.setDisabled(false)
            backCollector.on('collect', async i => {
                try {
                    if (i.user.id !== this.userMessage.author.id) return
                    i.deferUpdate()
                    this.page--
                    await this.updateMessage('pageswitch')
                } catch (e) {
                    console.warn(`Interaction said to be unknown, ignoring...`)
                }
            })
        }

        const components = []
        const buttonsComponents = new MessageActionRow()
        .addComponents(backButton, nextButton)
        components.push(buttonsComponents)

        if (this.supportLookUp) {
            const { individualElements } = this.pages
            const currentPageElements = individualElements[this.page]

            const selectElement = []

            for (let i = 0; i < currentPageElements.length; i++) {
                selectElement.push({
                    value: `ofl!!${this.message.id}!!${this.page}${i}`,
                    label: individualElements[this.page][i].description
                })
            }

            const elementSelector = new MessageSelectMenu()
                .setCustomId('select' + this.message.id)
                .setPlaceholder(this.menuSelectPlaceholder)
                .addOptions(selectElement)

            const selectCollector = this.message.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: this.idleTime
            })

            const optionsSelectFilter = (i) => {
                if (i.split('!!').length !== 3) return null
        
                const given = i.split('!!')
        
                return {
                    prefix: given[0],
                    id: given[1],
                    arg: given[2]
                }
            }

            selectCollector.on('collect', async i => {
                try {
                    if (i.user.id !== this.userMessage.author.id || i.guild.id !== this.message.guild.id || (!i.values || i.values.length === 0)) return
                    i.fetchReply()
                    selectCollector.resetTimer()
                    const { arg } = optionsSelectFilter(i.values[0])
                    this.lookingUp = true
                    await this.updateMessage('lookup', arg)
                } catch (e) {
                    console.warn(`Interaction said to be unknown, ignoring...`)
                }
            })

            const selectComponent = new MessageActionRow().addComponents(elementSelector)
            components.push(selectComponent)
        }

        return components
    }
}
