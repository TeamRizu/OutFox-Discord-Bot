const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommand, CommandOptionType } = require('slash-create');
const { hashBuildTypeToDescription, hashBuildNoteToDescription } = require('../utils/constants');
const { HashBuildFile } = require('../utils/hashbuild.js')
const HashBuildClass = new HashBuildFile()

module.exports = class MyBuildCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'mybuild',
      description: 'Get details from build by hash',
      options: [{
        type: CommandOptionType.STRING,
        name: 'hash',
        description: 'Build hash',
        required: true
      }]
    });
    this.commandVersion = '0.0.2'
    this.filePath = __filename;
  }

  async run(ctx, { interaction, commandArguments } = {}) {
    /**
     * @type {string}
     */
    const hash = commandArguments ? commandArguments.primalArgument : ctx.options.hash

    const buildData = HashBuildClass.buildByHash(hash)

    if (!buildData) return 'Could not find build.'

    const buttons = new MessageActionRow()
    let addedButtons = false

    const buildNotes = () => {
      let notes = ''
      for (let i = 0; i < buildData.notes.length; i++) {
        const currentNote = buildData.notes[i]

        if (currentNote.type === 'notice') {
          notes += `- ${currentNote.description}\n`
          continue
        }

        if (currentNote.type === 'hotfix_notice') {
          addedButtons = true
          buttons.addComponents(
            new MessageButton()
              .setCustomId(`10-${this.commandVersion}-run-${currentNote.hotfix_hash}`)
              .setLabel('Hotfix Build')
              .setStyle('PRIMARY')
          )
        }

        if (currentNote.type === 'release_candidate' && currentNote.final_hash) {
          addedButtons = true
          buttons.addComponents(
            new MessageButton()
              .setCustomId(`10-${this.commandVersion}-run-${currentNote.final_hash}`)
              .setLabel('Final Build')
              .setStyle('PRIMARY')
          )
        }

        notes += `- ${hashBuildNoteToDescription[currentNote.type]}\n`
      }
      return notes
    }

    const formatDate = () => {
      const year = buildData.date.substring(0,4)
      const month = buildData.date.substring(4, 6)
      const day = buildData.date.substring(6, 8)

      return `${day}/${month}/${year}`
    }

    const embed = new MessageEmbed()
      .setTitle(`Summary of ${buildData.name}`)
      .addField('Build Date (DD/MM/YYYY)', formatDate())
      .setDescription(hashBuildTypeToDescription[buildData.buildtype])
      .setColor('#bad0ff')
      .setFooter({ text: `Hash: ${hash}` })

    if (buildData.notes !== null) {
      embed.addField('Notes', buildNotes())
    }

    if (buildData.exclusive !== null) {
      embed.addField('Exclusive Version', `This build is exclusive to ${buildData.exclusive}`)
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
