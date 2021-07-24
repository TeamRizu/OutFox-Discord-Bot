// Files
const message = require('./listeners/message.js')
const indexCommand = require('./commands/index.js')

// Variables
/*
const { commands } = indexCommand
const commandList = Object.keys(commands)
const slashCommandsArr = []
*/

exports.main = async (client) => {

    /*
    console.log('Setup Slash Commands.')
    
    for (let i = 0; i < commandList.length; i++) {
        slashCommandsArr.push(commands[commandList[i]].slashCommand)
    }

    await client.guilds.cache.get(process.env.DEVSERVER)?.commands.set(slashCommandsArr)
    */

    console.log('OutFoxing messages')

    client.on('messageCreate', (msg) => {
        message.main(msg)
    })
}
