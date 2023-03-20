const { EmbedBuilder } = require('discord.js')

exports.main = () => {
  return new EmbedBuilder()
    .setTitle('OutFox Serenity Volume 2')
    .setDescription('Released September 4, 2022, Serenity Volume II features music by Ace of Beat, Finite Limit, Jack5, Kurio Prokos, Lagoona, Rilliam, rN, SiLiS, and td. It also features the Serenity debut of ds3ddx and kickbox mode charts.')
    .setColor('#782024')
    .setURL('https://projectoutfox.com/outfox-serenity/volume-ii')
    .setThumbnail('https://projectoutfox.com/storage/app/media/uploaded-files/serenity-2-jk-small.png')
    .addFields({
      name: 'OutFox Serenity Server',
      value: '[https://discord.gg/mNcFU67mK7](https://discord.gg/mNcFU67mK7)'
    })
    .setImage('https://raw.githubusercontent.com/TeamRizu/OutFox-Serenity/v2/OutFox%20Serenity%20Volume%202/banner.png')
}
