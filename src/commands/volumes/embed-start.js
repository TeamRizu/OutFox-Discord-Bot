const { EmbedBuilder } = require('discord.js')

exports.main = () => {
  return new EmbedBuilder()
    .setTitle('OutFox Serenity')
    .setDescription('OutFox Serenity is a community-driven project; musicians can submit freely-licensed songs for consideration by the Serenity team, which are then assigned to chart artists and designers to create their accompanying charts and graphics.\n\nInterested in contributing music, charts, or artwork for future editions of OutFox Serenity? Check out the [submission information and guidelines](https://projectoutfox.com/outfox-serenity/guidelines) for more information and [join our Serenity Discord server](https://discord.gg/mNcFU67mK7).')
    .setColor('#167756')
    .setURL('https://projectoutfox.com/outfox-serenity')
    .setThumbnail('https://cdn.discordapp.com/icons/807975893938339892/7d4c8e80286ddc00711be29bf8b9113b.webp')
    .addFields({
      name: 'OutFox Serenity Server',
      value: '[https://discord.gg/mNcFU67mK7](https://discord.gg/mNcFU67mK7)'
    })
    .setImage('https://projectoutfox.com/themes/moondance/assets/images/serenity-front-logo.png')
}
