// Files
const indexCommand = require('../commands/index.js')

// Variables
const { commands } = indexCommand
const commandList = Object.keys(commands)

exports.main = async (message) => {
    if (!message.content.startsWith(process.env.PREFIX)) return

    const content = message.content.split(process.env.PREFIX)[1]

    if (!commandList.includes(content)) return
    console.log(`Running command ${content}`)
    commands[content].run(message)
}
