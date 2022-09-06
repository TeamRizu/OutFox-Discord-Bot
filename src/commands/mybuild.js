const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SlashCommand, CommandOptionType, ComponentContext, Message } = require('slash-create');
const { hashBuildTypeToDescription, hashBuildNoteToDescription } = require('../utils/constants');
const { HashBuildFile } = require('../utils/hashbuild.js');
const HashBuildClass = new HashBuildFile();

module.exports = class MyBuildCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'mybuild',
      description: 'Get details from build by hash',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'hash',
          description: 'Build hash',
          required: true
        }
      ]
    });
    this.commandVersion = '0.0.3';
    this.filePath = __filename;
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ctx.defer();

    /**
     * @type {string}
     */
    const hash = ctx.options.hash;

    const buildData = HashBuildClass.buildByHash(hash);

    if (!buildData) return 'Could not find build.';

    const buildNotes = (build) => {
      let notes = '';
      for (let i = 0; i < build.notes.length; i++) {
        const currentNote = build.notes[i];

        if (currentNote.type === 'notice') {
          notes += `- ${currentNote.description}\n`;
          continue;
        }

        notes += `- ${hashBuildNoteToDescription[currentNote.type]}\n`;
      }
      return notes;
    };

    const formatDate = (build) => {
      const year = build.date.substring(0, 4);
      const month = build.date.substring(4, 6);
      const day = build.date.substring(6, 8);

      return `${day}/${month}/${year}`;
    };

    const buildComponents = (build) => {
      const buttons = new ActionRowBuilder();
      let addedButtons = false;

      for (let i = 0; i < build.notes.length; i++) {
        const currentNote = build.notes[i];

        if (currentNote.type === 'hotfix_notice') {
          addedButtons = true;
          buttons.addComponents(
            new ButtonBuilder()
              .setCustomId(`hotfix+${currentNote.hotfix_hash}`)
              .setLabel('Hotfix Build')
              .setStyle(ButtonStyle.Primary)
          );
        }

        if (currentNote.type === 'release_candidate' && currentNote.final_hash) {
          addedButtons = true;
          buttons.addComponents(
            new ButtonBuilder()
              .setCustomId(`finalrelease+${currentNote.final_hash}`)
              .setLabel('Final Build')
              .setStyle(ButtonStyle.Primary)
          );
        }
      }

      return addedButtons ? [buttons] : [];
    };

    const buildEmbed = (build) => {
      const embed = new EmbedBuilder()
        .setTitle(`Summary of ${build.name}`)
        .addFields({ name: 'Build Date (DD/MM/YYYY)', value: formatDate(build) })
        .setDescription(hashBuildTypeToDescription[build.buildtype])
        .setColor('#bad0ff')
        .setFooter({ text: `Hash: ${hash}` });

      if (build.notes !== null) {
        embed.addFields({ name: 'Notes', value: buildNotes(build) });
      }

      if (build.exclusive !== null) {
        embed.addFields({ name: 'Exclusive Version', value: `This build is exclusive to ${build.exclusive}` });
      }

      return embed;
    };

    const embed = buildEmbed(buildData);
    const components = buildComponents(buildData);

    /**
     * @type {Message}
     */
    const message = await ctx.send({
      embeds: [embed],
      components
    });

    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      const component = cCtx.customID;
      const newHash = component.split('+')[1];
      const newBuildData = HashBuildClass.buildByHash(newHash);
      const newEmbed = buildEmbed(newBuildData);
      const newComponents = buildComponents(newBuildData);

      await cCtx.acknowledge();
      await message.edit({
        embeds: [newEmbed],
        components: newComponents
      });
    });
  }
};
