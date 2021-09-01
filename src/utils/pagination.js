exports.Pagination = class {
    constructor(content) {
        this.maxLength = 2048
        this.pages = ['']
        this.pageIndex = 0
        this.content = content || []
    }

    setup(elementTemplate) {
        for (let i = 0; i < this.content.length; i++) {
            const stringToAdd = elementTemplate(this.content[i], i)

            if (!stringToAdd) continue

            if (
                this.pages[this.pageIndex].length + stringToAdd.length >
                this.maxLength
            ) {
                this.pageIndex++
            }

            if (typeof this.pages[this.pageIndex] !== 'string') {
                this.pages[this.pageIndex] = ''
            }

            this.pages[this.pageIndex] += stringToAdd
        }

        return this.pages
    }

    getPage(page) {
        if (this.pages[0] === '') {
            console.warn('Class not initialized yet, please run setup method')
            return ''
        }

        return this.pages[page]
    }
}
