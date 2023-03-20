exports.main = (pageContent = 'FALLBACK', listID = 'OUTFOX') => {
  const { EmbedBuilder } = require('discord.js')
  const archiveBuildEngineColor = require('./build-engine-color.js').main()
  const embed = new EmbedBuilder()
    .setTitle('Select Build')
    .setColor(archiveBuildEngineColor[listID])
    .setURL(`https://josevarela.net/SMArchive/Builds/index.php#div${listID}`)
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setDescription(pageContent)

  return embed
}
