const stringSimilarity = require('string-similarity');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SlashCommand, CommandOptionType, CommandContext, AutocompleteContext } = require('slash-create');
const { TermsFile } = require('../utils/terms.js');
const TermsClass = new TermsFile();

module.exports = class TermCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'term',
      description: 'What does this term mean?',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'name',
          description: 'Term name',
          required: true,
          autocomplete: true
        }
      ]
    });
    this.commandVersion = '0.0.2';
    this.filePath = __filename;
  }

  /**
   *
   * @param {AutocompleteContext} ctx
   * @returns
   */
  async autocomplete(ctx) {
    const text = ctx.options[ctx.focused];
    const matches = stringSimilarity.findBestMatch(text, TermsClass.terms);

    return [{ name: matches.bestMatch.target || text, value: matches.bestMatch.target || text }];
  }

  /**
   *
   * @param {CommandContext} ctx
   */
  async run(ctx) {
    /**
     * @type {string}
     */
    const name = ctx.options.name.toLowerCase();

    if (!TermsClass.terms.includes(name)) return 'Unknown term.';

    const termData = TermsClass.termObjectByName(name);

    if (!termData) return 'Failed to get term data.';

    const buildAliases = (term) => {
      let notes = '';

      for (let i = 0; i < term.aliases.length; i++) {
        const currentAlias = term.aliases[i];
        const properAlias = term.properAlias[currentAlias];

        if (term.alisesExplanation && term.alisesExplanation[currentAlias]) {
          // FIXME: This might not be working?
          notes += `- ${properAlias}: ${term.alisesExplanation[currentAlias]}\n`;
          continue;
        }

        notes += `- ${properAlias}\n`;
      }

      return notes;
    };

    const buildEmbed = (term) => {
      const embed = new EmbedBuilder().setTitle(term.properName).setDescription(term.explanation);

      if (term.decorations) {
        if (term.decorations.thumbnail) embed.setThumbnail(term.decorations.thumbnail);
        if (term.decorations.image) embed.setImage(term.decorations.image);
        if (term.decorations.color) embed.setColor(term.decorations.color);
      }

      if (term.aliases) {
        embed.addFields({ name: 'Also known as', value: buildAliases(term) });
      }

      return embed;
    };

    const buildComponents = (term) => {
      let addedButtons = false;
      const buttons = new ActionRowBuilder();

      if (termData.references) {
        for (let i = 0; i < term.references.length; i++) {
          const currentReference = term.references[i];
          const button = new ButtonBuilder();

          switch (currentReference.type) {
            case 'url':
              button.setStyle(ButtonStyle.Link);
              button.setURL(currentReference.url);
              button.setLabel(currentReference.label);
              break;
            case 'term':
              const referenceTerm = TermsClass.termObjectByName(currentReference.term);

              button.setStyle(ButtonStyle.Primary);
              button.setLabel(referenceTerm.label || `See ${referenceTerm.properName}`);
              button.setCustomId(`term+${currentReference.term}`);
              break;
          }

          buttons.addComponents(button);
        }
        addedButtons = true;
      }

      return addedButtons ? [buttons] : [];
    };

    await ctx.defer();
    const embed = buildEmbed(termData);
    const components = buildComponents(termData);

    const message = await ctx.send({
      embeds: [embed],
      components
    });

    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      const component = cCtx.customID;

      if (component.startsWith('term')) {
        const termName = component.split('+')[1];

        await cCtx.acknowledge();

        if (!TermsClass.terms.includes(termName)) {
          message.edit({
            content: 'Something is wrong with our data, please report to OutFox Team'
          });
          return;
        }

        const newTermData = TermsClass.termObjectByName(termName);

        if (!newTermData) {
          message.edit({
            content: 'Something is wrong with our data, please report to OutFox Team'
          });
          return;
        }

        const newEmbed = buildEmbed(newTermData);
        const newComponents = buildComponents(newTermData);

        await message.edit({
          embeds: [newEmbed],
          components: newComponents
        });
      }
    });
  }
};
