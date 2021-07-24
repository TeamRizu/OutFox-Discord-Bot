// Files
const outfox = require('../outfox.js')

exports.main = (client) => {
    console.log('Setup globals')

    console.log('Ready to OutFox!')
    outfox.main(client)
}
