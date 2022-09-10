const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle } = require('discord.js');
const { SlashCommand, ComponentContext, Message } = require('slash-create');

const start = new EmbedBuilder();
start.setTitle('OutFox Serenity');
start.setDescription(
  `OutFox Serenity is a community-driven project; musicians can submit freely-licensed songs for consideration by the Serenity team, which are then assigned to chart artists and designers to create their accompanying charts and graphics.

  Interested in contributing music, charts, or artwork for future editions of OutFox Serenity? Check out the [submission information and guidelines](https://projectoutfox.com/outfox-serenity/guidelines) for more information and [join our Serenity Discord server](https://discord.gg/mNcFU67mK7).`
);
start.setColor('#167756');
start.setURL('https://projectoutfox.com/outfox-serenity');
start.setThumbnail('https://cdn.discordapp.com/icons/807975893938339892/7d4c8e80286ddc00711be29bf8b9113b.webp');
start.addFields({
  name: 'OutFox Serenit Server',
  value: '[https://discord.gg/mNcFU67mK7](https://discord.gg/mNcFU67mK7)'
});
start.setImage('https://projectoutfox.com/themes/moondance/assets/images/serenity-front-logo.png');

const v1 = new EmbedBuilder();
v1.setTitle('OutFox Serenity Volume 1');
v1.setDescription(
  `Released August 27, 2021, **Serenity Volume I** features music by Aspid Cat, Drazil, Jack5, Matduke, mmry, PizeroFox, Seo, and Sevish. Alongside 4-panel (dance) and 5-panel (pump) charts, some of its songs also have Be-Mu, Po-Mu, techno (8- and 9-panel), gddm, and gdgf, and gh charts.

  The **Winter Update (version 1.5)** adds three new songs by DJ Megas, Matduke and Pekoneko (ペコネコ), keysounded versions of selected songs for be-mu, po-mu, and gh mode, as well as more new charts—including Serenity's first ez2 (simulating ez2Dancer), maniax (simulating Dance ManiaX), and smx charts.`
);
v1.setColor('#24756d');
v1.setURL('https://projectoutfox.com/outfox-serenity/volume-i');
v1.setThumbnail('https://projectoutfox.com/storage/app/media/uploaded-files/serenity-update-jk.png');
v1.addFields({
  name: 'OutFox Serenity Server',
  value: '[https://discord.gg/mNcFU67mK7](https://discord.gg/mNcFU67mK7)'
});
v1.setImage(
  'https://raw.githubusercontent.com/TeamRizu/OutFox-Serenity/main/OutFox%20Serenity%20Volume%201/banner.png'
);

const v2 = new EmbedBuilder();
v2.setTitle('OutFox Serenity Volume 2');
v2.setDescription(
  `Released September 4, 2022, Serenity Volume II features music by Ace of Beat, Finite Limit, Jack5, Kurio Prokos, Lagoona, Rilliam, rN, SiLiS, and td. It also features the Serenity debut of ds3ddx and kickbox mode charts.`
);
v2.setColor('#782024');
v2.setURL('https://projectoutfox.com/outfox-serenity/volume-ii');
v2.setThumbnail('https://projectoutfox.com/storage/app/media/uploaded-files/serenity-2-jk-small.png');
v2.addFields({
  name: 'OutFox Serenity Server',
  value: '[https://discord.gg/mNcFU67mK7](https://discord.gg/mNcFU67mK7)'
});
v2.setImage('https://raw.githubusercontent.com/TeamRizu/OutFox-Serenity/v2/OutFox%20Serenity%20Volume%202/banner.png');

const embeds = {
  start,
  'volume 1': v1,
  'volume 2': v2
};

module.exports = class VolumesCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'volumes',
      description: 'Get information for Serenity Volumes.'
    });
    this.commandVersion = '0.0.3';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ctx.fetch();
    const checkoutVolumeSelectMenu = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId(`volumeselectmenu`)
        .setPlaceholder('Checkout Volumes')
        .addOptions([
          {
            label: `Volume 1`,
            description: `Released August 27, 2021`,
            value: `v1`
          },
          {
            label: `Volume 2`,
            description: `Released September 4, 2022`,
            value: `v2`
          }
        ])
    );

    const msgData = {
      embeds: [embeds.start],
      components: [checkoutVolumeSelectMenu]
    };
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`back`).setLabel('Back to Serenity').setStyle(ButtonStyle.Primary)
    );
    /**
     * @type {Message}
     */
    const message = await ctx.send(msgData);

    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      const selectedVolume = cCtx.values[0];

      await cCtx.acknowledge()
      switch (selectedVolume) {
        case 'v1':
          await message.edit({
            embeds: [embeds['volume 1']],
            components: [button]
          });
          break;
        case 'v2':
          await message.edit({
            embeds: [embeds['volume 2']],
            components: [button]
          });
          break;
        default: // back
          await message.edit({
            embeds: [embeds['start']],
            components: [checkoutVolumeSelectMenu]
          });
          break;
      }
    });
  }
};
