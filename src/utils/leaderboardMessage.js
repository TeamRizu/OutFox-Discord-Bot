// Libs
const Discord = require('discord.js')

// Files
const buttons = require('./buttons.js')
const embeds = require('./embed.js')

// Variables
const { MessageActionRow, MessageSelectMenu } = Discord
exports.LeaderboardMessage = class {
    constructor(message, language) {
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
        this.language = language
        this.formatElement = (e, i) => {

            if (typeof e === 'object') {
                return e.description || 'UNKNOWN_OBJECT_ELEMENT_DESCRIPTION'
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
            const elementString = this.formatElement(currentElement, i)

            // If the addition of the element will make the page bigger than allowed, then create a new page.
            if ((pageContent.length + elementString.length) > this.charsPerPage) {
                pageList.push(pageContent)
                pageContent = ''
            }

            if (individualElements[pageList.length] === undefined) {
                individualElements[pageList.length] = []
            }
            individualElements[pageList.length].push(typeof currentElement === 'object' ? currentElement : elementString)
            pageContent += elementString

            // If we reach the limit of elements per page, add the current content to the page list.
            if ((i % this.elementsPerPage) === 0) {
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
                            description: this.pages[this.page],
                            footer: `${this.page + 1}/${this.pages.pageList.length}`
                        })
                    ],
                    components: [this.pageComponents]
                })
            break
            default:
                await this.message.edit({
                    // The default lookUpFunc is not async but one defined by the user is.
                    embeds: [await this.lookUpFunc( this.pages.individualElements[args[0]][args[1]] )],
                    components: [this.pageComponents]
                })
            break
        }
    }

    get pageComponents() {

        if (this.lookingUp) {
            const { button: stopLookingButton, collector: stopLookingCollector } = buttons.quickBetterButton(
                this.message,
                'stoplooking' + this.message.id,
                this.language('generic', 'lookUpBack'),
                'PRIMARY',
                { timer: this.idleTime }
            )

            stopLookingCollector.on('collect', async i => {
                i.deferUpdate()
                await this.updateMessage('stoplooking')
                this.lookingUp = false
            })

            return new MessageActionRow().addComponents(stopLookingButton)
        }

        const pageCount = this.pages.pageList.length
        const isNextPossible = !((this.page + 1) > pageCount)
        const isBackPossible = !((this.page - 1) < pageCount)

        const { button: backButton, collector: backCollector } = buttons.quickBetterButton(
            this.message,
            'back' + this.message.id,
            this.language('leaderboard', 'GoBack'),
            'PRIMARY',
            { timer: this.idleTime }
        )

        const { button: nextButton, collector: nextCollector } = buttons.quickBetterButton(
            this.message,
            'next' + this.message.id,
            this.language('leaderboard', 'NextPage'),
            'PRIMARY',
            { timer: this.idleTime }
        )

        if (!isNextPossible) {
            nextButton.setDisabled(true)
        } else {
            nextCollector.on('collect', async i => {
                i.deferUpdate()
                this.page++
                await this.updateMessage('pageswitch')
            })
        }

        if (!isBackPossible) {
            backButton.setDisabled(true)
        } else {
            backCollector.on('collect', async i => {
                i.deferUpdate()
                this.page++
                await this.updateMessage('pageswitch')
            })
        }

        const components = new MessageActionRow()
        components.addComponents(backButton, nextButton)

        if (this.supportLookUp) {
            const { individualElements } = this.pages
            const currentPageElements = individualElements[this.page]

            const selectElement = []

            for (let i = 0; i < currentPageElements.length; i++) {
                selectElement.push({
                    value: `ofl!!${message.id}!!${this.page}${i}`
                })
            }

            const elementSelector = MessageSelectMenu()
                .setCustomId('select' + message.id)
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
                if (i.user.id !== message.author.id || i.guild.id !== message.guild.id || (!i.values || i.values.length === 0)) return

                i.deferUpdate()
                
                const { arg } = optionsSelectFilter(i.values[0])
                this.lookingUp = true
                await this.updateMessage('lookup', arg)
            })

            components.addComponents(elementSelector)
        }

        return components
    }
}
