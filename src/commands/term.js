const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommand, CommandOptionType } = require('slash-create');
const { TermsFile } = require('../utils/terms.js')
const TermsClass = new TermsFile()

module.exports = class TermCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'term',
      description: 'What does this term mean?',
      options: [{
        type: CommandOptionType.STRING,
        name: 'name',
        description: 'Term name',
        required: true
      }]
    });
    this.commandVersion = '0.0.1'
    this.filePath = __filename;
  }

  async run(ctx, { interaction, commandArguments } = {}) {
    /**
     * @type {string}
     */
    const name = commandArguments ? commandArguments.primalArgument.toLowerCase() : ctx.options.name.toLowerCase()

    if (!TermsClass.terms.includes(name)) return 'Unknown term.'

    const termData = TermsClass.termObjectByName(name)

    if (!termData) return 'Failed to get term data.'

    const buttons = new MessageActionRow()
    let addedButtons = false

    const buildAliases = () => {
      let notes = ''

      for (let i = 0; i < termData.aliases.length; i++) {
        const currentAlias = termData.aliases[i]
        const properAlias = termData.properAlias[currentAlias]

        if (termData.alisesExplanation && termData.alisesExplanation[currentAlias]) {
          notes += `- ${properAlias}: ${termData.alisesExplanation[currentAlias]}`
        }

        notes += `- ${properAlias}\n`
      }

      return notes
    }

    const embed = new MessageEmbed()
      .setTitle(termData.properName)
      .setDescription(termData.explanation)

    if (termData.decorations) {
      if (termData.decorations.thumbnail) embed.setThumbnail(termData.decorations.thumbnail)
      if (termData.decorations.image) embed.setImage(termData.decorations.image)
      if (termData.decorations.color) embed.setColor(termData.decorations.color)
    }

    if (termData.aliases) {
      embed.addField('Also known as', buildAliases())
    }

    if (termData.references) {
      for (let i = 0; i < termData.references.length; i++) {
        const currentReference = termData.references[i]
        const button = new MessageButton()

        switch (currentReference.type) {
          case 'url':
            button.setStyle('LINK')
            button.setURL(currentReference.url)
            button.setLabel(currentReference.label)
          break
          case 'term':
            const referenceTerm = TermsClass.termObjectByName(currentReference.term)

            button.setStyle('PRIMARY')
            button.setLabel(referenceTerm.label || `See ${referenceTerm.properName}`)
            button.setCustomId(`11-${this.commandVersion}-run-${currentReference.term}`)
          break
        }

        buttons.addComponents(button)
      }
      addedButtons = true
    }

    const components = addedButtons ? [buttons] : []
    if (interaction) {
      ctx.editParent({
        embeds: [embed],
        components
      })
    } else {
      ctx.send({
        embeds: [embed],
        components
      })
    }
  }
}
