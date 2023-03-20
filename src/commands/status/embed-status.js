const { EmbedBuilder } = require('discord.js')
const {
  nodeJSVersion, discordJSVersion, slashCreateVersion,
  systemMemUsage, systemArchitecture, systemPlatform, systemCPU,
  processUptime
} = require('./functions.js')

exports.main = () => {
  return new EmbedBuilder()
    .setAuthor({ name: 'Project OutFox Instance Status' })
    .setDescription('This instance is using NodeJS ' + nodeJSVersion() + ', running DiscordJS ' + discordJSVersion() + ' and Slash Create ' + slashCreateVersion() + '.')
    .setColor('#002c73')
    .addFields(
      { name: 'RAM Usage', value: 'Total System: ' + systemMemUsage(), inline: true },
      { name: 'System Architecture & Platform', value: 'Architecture: ' + systemArchitecture() + '\nPlatform: ' + systemPlatform(), inline: true },
      { name: 'CPU', value: systemCPU(), inline: true },
      { name: 'Uptime', value: processUptime(), inline: true }
    )
}
