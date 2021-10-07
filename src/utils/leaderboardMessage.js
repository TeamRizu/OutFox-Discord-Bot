// Libs
const Discord = require('discord.js')

// Files
const buttons = require('./buttons.js')

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
        this.idleTime = 120000
        this.message = message
        this.language = language
        this.formatElement = (e, i) => {
            return i ? `${i}° ${e}` : (e || 'UNKNOWN_ELEMENT')
        }
    }

    addElement(element) {
        if (typeof element === 'string' || typeof element === 'object') {

            if (this.elements.length !== 0 && !this.elements.every(e => typeof e === typeof element)) {
                console.warn(`Trying to add different element type to an array already made out of `, typeof element)
                return false
            }

            if ((typeof element === 'string' && element.length > this.charsPerElement) || this.formatElement(element).length > this.charsPerElement) {
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
        let pageContent = ''

        for (let i = 0; i < this.elements.length; i++) {
            const currentElement = this.elements[i]
            const elementString = this.formatElement(currentElement, i)

            // If the addition of the element will make the page bigger than allowed, then create a new page.
            if ((pageContent.length + elementString.length) > this.charsPerPage) {
                pageList.push(pageContent)
                pageContent = ''
            }

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

        return pageList
    }

    async updateMessage(reason) {
        // TODO: Almost no operation should be done here, only the update of the message itself.
    }

    get pageComponents() {
        const pageCount = this.pages.length
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

        if (this.supportLookUp) {
            const pageContent = this.pages[this.page]

            const selectElement = []

            for (let i = 0; i < pageContent.length; i++) {
                selectElement.push({
                    value: `ofl!!${message.id}!!` // TODO: pageElements is NOT an array of elements, its a string of the entire page. 
                })
            }
        }
        // TODO: Should return an ActionRow of all the buttons.
    }
}
