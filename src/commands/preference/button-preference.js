const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

exports.main = () => {
  return new ActionRowBuilder().addComponents(
    // new ButtonBuilder()
    //   .setStyle(ButtonStyle.Link)
    //   .setURL('https://outfox.wiki/user-guide/config/preferences/#' + preferenceName.replace(' ', '%20'))
    //   .setLabel('See on Page')
    // ,
    new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('Another Preference')
      .setCustomId('startagain')
  )
}
