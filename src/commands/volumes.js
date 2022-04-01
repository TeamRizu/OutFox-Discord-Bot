const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommand } = require('slash-create');
const mainSerenityEmbed = new MessageEmbed()
  .setTitle('OutFox Serenity')
  .setDescription(
    `OutFox Serenity is a community-driven project; musicians can submit freely-licensed songs for consideration by the Serenity team, which are then assigned to chart artists and designers to create their accompanying charts and graphics.

    Interested in contributing music, charts, or artwork for future editions of OutFox Serenity? Check out the [submission information and guidelines](https://projectoutfox.com/outfox-serenity/guidelines) for more information and [join our Serenity Discord server](https://discord.gg/mNcFU67mK7).`
  );

module.exports = class VolumesCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'volumes',
      description: 'Get information for Serenity Volumes.'
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    this.update(ctx, 0, true) 
  }

  async update(ctx, pageIndex, firstSend) {

    const checkoutVolumeSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(`0-${ctx.interactionID}-0-select`)
        .setPlaceholder('Checkout Volumes')
        .addOptions([
          {
            label: `Volume 1 Winter Update`,
            description: `Released August 27, 2021`,
            value: `0-${ctx.interactionID}-0-select`
          },
          {
            label: `Volume 2`,
            description: `In production`,
            value: `0-${ctx.interactionID}-1-select`
          }
        ])
    );

    ctx.send({
      embeds: [mainSerenityEmbed],
      components: [checkoutVolumeSelectMenu]
    })

    const msgData = {
      embeds: [mainSerenityEmbed],
      components: [checkoutVolumeSelectMenu]
    };

    if (firstSend) {
      ctx.send(msgData);
    } else {
      ctx.editParent(msgData);
    }
  }

  async lookUp(ctx, argument, firstSend, values) {
    const page = values[0].split('-')[2]
    const description = [
      `
      Released August 27, 2021, **Serenity Volume I** features music by Aspid Cat, Drazil, Jack5, Matduke, mmry, PizeroFox, Seo, and Sevish. Alongside 4-panel (dance) and 5-panel (pump) charts, some of its songs also have Be-Mu, Po-Mu, techno (8- and 9-panel), gddm, and gdgf, and gh charts.

      The **Winter Update (version 1.5)** adds three new songs by DJ Megas, Matduke and Pekoneko (ペコネコ), keysounded versions of selected songs for be-mu, po-mu, and gh mode, as well as more new charts—including Serenity's first ez2 (simulating ez2Dancer), maniax (simulating Dance ManiaX), and smx charts.`,
      `
      Serenity Volume II will feature music by Ace of Beat, Finite Limit, Jack5, Kurio Prokos, Lagoona, Rilliam, rN, SiLiS, and td. We will be accepting chart and song artwork submissions beginning March 27.
      `
    ]

    const volumeEmbed = new MessageEmbed()
    .setTitle(`OutFox Serenity Volume ${page + 1}`)
    .setDescription(description[page]);

    const button = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`0-${ctx.interactionID}-start`)
        .setLabel('Back to Serenity')
        .setStyle('PRIMARY')
    );

    ctx.send({
      embeds: [volumeEmbed],
      components: []
    })
  }
}
