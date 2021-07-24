console.log('Start')

// Libs
const Discord = require('discord.js')
require('dotenv').config()

// Files
const ready = require('./listeners/ready.js')

// Variables
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]})

client.on('ready', () => {
    ready.main(client)
})

client.login(process.env.TOKEN)