// Libs
const Discord = require('discord.js')

/**
 * Makes a object with the content given arguments.
 * @param {Discord.Message} message - The message object
 * @returns {Object<string, (string | string[]>)}
 */
exports.filterArguments = (message) => {
    /*
    const obj = {
        content,
        arguments[],
        command
    }
    */

    const args = message.content.split(' ')
    const detectedArgs = {}
    const pushAgr = (argType, value) => {
        if (detectedArgs[argType]) {
          detectedArgs[argType].push(value)
          return
        }
        detectedArgs[argType] = [value]
    }

    for (let i = 0; i < args.length; i++) {
        const current = args[i]

        if (current.toLowerCase().startsWith(process.env.PREFIX)) {
            const commandName = current.substring(process.env.PREFIX.length).toLowerCase()

            if (commandName.length === 0) continue

            pushAgr('commandName', commandName)
            continue
        }

        if (current.startsWith('--') && current.substring(2).length >= 1) {
            pushAgr('flag', current.toLowerCase())
            continue
        }

        if (current.length >= 16 && current.length <= 18 && !isNaN(current)) {
            pushAgr('id', current)
            continue
        }

        pushAgr('argument', current)
    }

    return detectedArgs
}
