exports.main = (engine = 'OUTFOX', pageContent = 'FALLBACK') => {
  const { EmbedBuilder } = require('discord.js')
  const archiveEngineColors = require('./build-engine-color.js').main()
  const pageEmbed = new EmbedBuilder()
    .setTitle('Select Theme')
    .setColor(archiveEngineColors[engine.toUpperCase()])
    .setURL('https://josevarela.net/SMArchive/Themes/')
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setDescription(pageContent)

  return pageEmbed
}
