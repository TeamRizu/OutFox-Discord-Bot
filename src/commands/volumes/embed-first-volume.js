const { EmbedBuilder } = require('discord.js')

exports.main = () => {
  return new EmbedBuilder()
    .setTitle('OutFox Serenity Volume 1')
    .setDescription('Released August 27, 2021, **Serenity Volume I** features music by Aspid Cat, Drazil, Jack5, Matduke, mmry, PizeroFox, Seo, and Sevish. Alongside 4-panel (dance) and 5-panel (pump) charts, some of its songs also have Be-Mu, Po-Mu, techno (8- and 9-panel), gddm, and gdgf, and gh charts.\n\nThe **Winter Update (version 1.5)** adds three new songs by DJ Megas, Matduke and Pekoneko (ペコネコ), keysounded versions of selected songs for be-mu, po-mu, and gh mode, as well as more new charts—including Serenity\'s first ez2 (simulating ez2Dancer), maniax (simulating Dance ManiaX), and smx charts.')
    .setColor('#24756d')
    .setURL('https://projectoutfox.com/outfox-serenity/volume-i')
    .setThumbnail('https://projectoutfox.com/storage/app/media/uploaded-files/serenity-update-jk.png')
    .addFields({
      name: 'OutFox Serenity Server',
      value: '[https://discord.gg/mNcFU67mK7](https://discord.gg/mNcFU67mK7)'
    })
    .setImage('https://raw.githubusercontent.com/TeamRizu/OutFox-Serenity/main/OutFox%20Serenity%20Volume%201/banner.png')
}
