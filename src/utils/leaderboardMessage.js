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
        this.collectors = []
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
            let hasPushed = false

            if (!elementString) {
                continue
            }

            // If the addition of the element will make the page bigger than allowed, then create a new page.
            if ((pageContent.length + elementString.length) > this.charsPerPage) {
                pageList.push(pageContent)
                pageContent = ''
                hasPushed = true
            }

            const individualPageIndex = pageList.length 
            
            // pageList.length > 0 ? pageList.length - 1 : pageList.length
            if (individualElements[individualPageIndex] === undefined) {
                individualElements[individualPageIndex] = []
            }
            individualElements[individualPageIndex].push(typeof currentElement === 'object' ? currentElement : elementString)
            pageContent += `\n${elementString}`

            // If we reach the limit of elements per page, add the current content to the page list.
            const curPageElements = individualElements[individualPageIndex].length + 1
            if (!hasPushed && i !== 0 && curPageElements >= this.elementsPerPage) {
                pageList.push(pageContent)
                pageContent = ''
                hasPushed = true
                continue // We need this here so the condition bellow doesn't run if this runs, which would add 2 pages.
            }

            if (!hasPushed && i === (this.elements.length - 1)) {
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
                const embed = await this.lookUpFunc( this.pages.individualElements[args[0][0]][args[0][1]] )
                this.message.edit({
                    // The default lookUpFunc is not async but one defined by the command can be.
                    embeds: [embed],
                    components: this.pageComponents
                })
            break
        }
    }

    get pageComponents() {

        if (this.lookingUp) {
            return []
        }
        // if (this.lookingUp) {
        //     const { button: stopLookingButton, collector: stopLookingCollector } = buttons.quickBetterButton(
        //         this.message,
        //         'stoplooking' + this.message.id,
        //         this.language.readLine('generic', 'lookUpBack'),
        //         'PRIMARY',
        //         { timer: this.idleTime }
        //     )

        //     stopLookingCollector.on('collect', async i => {
        //         try {
        //             if (i.user.id !== this.userMessage.author.id) return
        //             await i.deferReply()
        //             await this.updateMessage('stoplooking')
        //             this.lookingUp = false
        //         } catch (e) {
        //             console.warn(`Interaction said to be unknown, ignoring...`)
        //         }
        //     })

        //     return [new MessageActionRow().addComponents(stopLookingButton)]
        // }

        const pageCount = this.pages.pageList.length - 1
        const isNextPossible = !((this.page + 1) > pageCount)
        const isBackPossible = !((this.page - 1) < 0)

        const backButton = buttons.quickButton(
            this.userMessage.id + 'back',
            this.language.readLine('leaderboard', 'GoBack'),
            'PRIMARY'
        )

        const nextButton = buttons.quickButton(
            this.userMessage.id + 'next',
            this.language.readLine('leaderboard', 'NextPage'),
            'PRIMARY'
        )

        if (this.collectors.length === 0) {

            let backCollector = this.message.createMessageComponentCollector({
                timer: 60000, 
                filter: (i) => {
                    if (i.user.id !== this.userMessage.author.id) return false

                    if (i.customId !== (this.userMessage.id + 'back')) return false

                    return true
                },
                max: 50
            })

            let nextCollector = this.message.createMessageComponentCollector({
                timer: 60000, 
                filter: (i) => {
                    if (i.user.id !== this.userMessage.author.id) return false

                    if (i.customId !== (this.userMessage.id + 'next')) return false

                    return true
                },
                max: 50
            })

            nextCollector.on('collect', async i => {
                if (i.user.id !== this.userMessage.author.id) return
                if (!i.replied || !i.deffered || !((Date.now() - i.createdAt) >= 3000)) {
                    i.deferUpdate()
                }
                this.page++
                await this.updateMessage('pageswitch', i)
            })

            backCollector.on('collect', async i => {
                if (i.user.id !== this.userMessage.author.id) return
                if (!i.replied || !i.deffered || !((Date.now() - i.createdAt) >= 3000)) {
                    i.deferUpdate()
                }
                this.page--
                await this.updateMessage('pageswitch')
            })
            this.collectors = [backCollector, nextCollector]
        }

        this.collectors[0].resetTimer()
        this.collectors[1].resetTimer()

        if (!isNextPossible) {
            nextButton.setDisabled(true)
        } else {
            nextButton.setDisabled(false)
            
        }

        if (!isBackPossible) {
            backButton.setDisabled(true)
        } else {
            backButton.setDisabled(false)
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
                if (i.user.id !== this.userMessage.author.id || i.guild.id !== this.message.guild.id || (!i.values || i.values.length === 0)) return
                if (!i.replied || !i.deffered || !((Date.now() - i.createdAt) >= 3000)) {
                    await i.deferUpdate().catch(e => console.error(e))
                }
                
                selectCollector.resetTimer()
                const { arg } = optionsSelectFilter(i.values[0])
                this.lookingUp = true
                selectCollector.stop()
                await this.updateMessage('lookup', [arg, i])
            })

            const selectComponent = new MessageActionRow().addComponents(elementSelector)
            components.push(selectComponent)
        }

        return components
    }
}
