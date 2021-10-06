exports.LeaderboardMessage = class {
    constructor(message) {
        this.elements = []
        this.page = 0
        this.elementsPerPage = 25
        this.charsPerPage = 1400
        this.supportLookUp = false // If enabled, the message author can type the number of the element to read more about it. Only supported for Object elements.
        this.options = ['back', 'next']
        this.idleTime = 120000
        this.message = message
        this.formatElement = (e) => {
            return e || 'UNKNOWN_ELEMENT'
        }
    }

    addElement(element) {
        if (typeof element === 'string' || typeof element === 'object') {

            if (this.elements.length !== 0 && !this.elements.every(e => typeof e === typeof element)) {
                console.warn(`Trying to add different element type to an array already made out of `, typeof element)
                return false
            }

            this.elements.push(element)
            return true
        }

        console.warn('Added bad element to LeaderboardMessage, ', element)
        return false
    }

    get pages() {
        // TODO: Do a for loop for each element (*this.elementsPerPage), using formatElement, to get the length of each comparing with this.charsPerPage
    }

    async updateMessage(reason) {
        // TODO: Almost no operation should be done here, only the update of the message itself.
    }

    pageButtons() {
        // Should return an ActionRow of all the buttons.
    }
}
