const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommand } = require('slash-create');
const embeds = {
  start: new MessageEmbed()
    .setTitle('OutFox Serenity')
    .setDescription(
      `OutFox Serenity is a community-driven project; musicians can submit freely-licensed songs for consideration by the Serenity team, which are then assigned to chart artists and designers to create their accompanying charts and graphics.

      Interested in contributing music, charts, or artwork for future editions of OutFox Serenity? Check out the [submission information and guidelines](https://projectoutfox.com/outfox-serenity/guidelines) for more information and [join our Serenity Discord server](https://discord.gg/mNcFU67mK7).`
    )
    .setColor('#167756')
    .setURL('https://projectoutfox.com/outfox-serenity')
    .setThumbnail('https://cdn.discordapp.com/icons/807975893938339892/7d4c8e80286ddc00711be29bf8b9113b.webp')
    .addField('OutFox Serenity Server', '[https://discord.gg/mNcFU67mK7](https://discord.gg/mNcFU67mK7)')
    .setImage('https://projectoutfox.com/themes/moondance/assets/images/serenity-front-logo.png'),
  'volume 1': new MessageEmbed()
    .setTitle('OutFox Serenity Volume 1')
    .setDescription(
      `Released August 27, 2021, **Serenity Volume I** features music by Aspid Cat, Drazil, Jack5, Matduke, mmry, PizeroFox, Seo, and Sevish. Alongside 4-panel (dance) and 5-panel (pump) charts, some of its songs also have Be-Mu, Po-Mu, techno (8- and 9-panel), gddm, and gdgf, and gh charts.

      The **Winter Update (version 1.5)** adds three new songs by DJ Megas, Matduke and Pekoneko (ペコネコ), keysounded versions of selected songs for be-mu, po-mu, and gh mode, as well as more new charts—including Serenity's first ez2 (simulating ez2Dancer), maniax (simulating Dance ManiaX), and smx charts.`
    )
    .setColor('#24756d')
    .setURL('https://projectoutfox.com/outfox-serenity/volume-i')
    .setThumbnail('https://projectoutfox.com/storage/app/media/uploaded-files/serenity-update-jk.png')
    .addField('OutFox Serenity Server', '[https://discord.gg/mNcFU67mK7](https://discord.gg/mNcFU67mK7)')
    .setImage('https://raw.githubusercontent.com/TeamRizu/OutFox-Serenity/main/OutFox%20Serenity%20Volume%201/banner.png'),
  'volume 2': new MessageEmbed()
    .setTitle('OutFox Serenity Volume 2')
    .setDescription(
      `Serenity Volume II will feature music by Ace of Beat, Finite Limit, Jack5, Kurio Prokos, Lagoona, Rilliam, rN, SiLiS, and td. We will be accepting chart and song artwork submissions beginning March 27.`
    )
    .setColor('#782024')
    .setURL('https://projectoutfox.com/news/outfox-serenity-volume-2-more')
    .setThumbnail('https://projectoutfox.com/storage/app/media/uploaded-files/serenity-2-jk-small.png')
    .addField('OutFox Serenity Server', '[https://discord.gg/mNcFU67mK7](https://discord.gg/mNcFU67mK7)')
    .setImage('https://raw.githubusercontent.com/TeamRizu/OutFox-Serenity/v2/OutFox%20Serenity%20Volume%202/banner.png'),
}

module.exports = class VolumesCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'volumes',
      description: 'Get information for Serenity Volumes.'
    });
    this.commandVersion = '0.0.1'
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await this.update({
      interaction: {
        ctx,
        values: []
      },
      commandArguments: {
        primalArgument: '0',
        arguments: ['0'],
        version: this.commandVersion,
        firstSend: true
      }
    })
  }

  async update({interaction, commandArguments}) {

    const checkoutVolumeSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(`0-${this.commandVersion}-lookUp-2`)
        .setPlaceholder('Checkout Volumes')
        .addOptions([
          {
            label: `Volume 1 Winter Update`,
            description: `Released August 27, 2021`,
            value: `0-${this.commandVersion}-lookUp-0`
          },
          {
            label: `Volume 2`,
            description: `In production`,
            value: `0-${this.commandVersion}-lookUp-1`
          }
        ])
    );

    const msgData = {
      embeds: [embeds.start],
      components: [checkoutVolumeSelectMenu]
    };

    if (commandArguments.firstSend) {
      interaction.ctx.send(msgData);
    } else {
      interaction.ctx.editParent(msgData);
    }
  }

  async lookUp({interaction, commandArguments}) {
    const page = interaction.values[0].split('-')[3]
    const pageIntoVolume = ['volume 1', 'volume 2'][page]

    const button = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`0-${this.commandVersion}-update-start`)
        .setLabel('Back to Serenity')
        .setStyle('PRIMARY')
    );

    interaction.ctx.send({
      embeds: [embeds[pageIntoVolume]],
      components: [button]
    })
  }
}
