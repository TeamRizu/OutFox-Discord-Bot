const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

exports.main = () => {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('volumeselectmenu')
    .setPlaceholder('Checkout Volumes')
    .addOptions([
      {
        label: 'Volume 1',
        description: 'Released August 27, 2021',
        value: 'v1'
      },
      {
        label: 'Volume 2',
        description: 'Release September 4, 2022',
        value: 'v2'
      }
    ])

  const row = new ActionRowBuilder().addComponents(selectMenu)

  return row
}
