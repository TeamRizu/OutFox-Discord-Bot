const { SlashCommand } = require('slash-create');

module.exports = class VolumesCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'volumes',
      description: 'Get links for Serenity Volumes'
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    const volumes = {
      'Volume 1': 'https://github.com/TeamRizu/OutFox-Serenity/releases/tag/v1.1',
      'Volume 1 Winter Update': 'https://github.com/TeamRizu/OutFox-Serenity/releases/tag/v1.5'
    }
    const availableVolumesString = () => {
      let finalString = 'Here is a list of all available serenity packs for now:\n\n'
      const volumeNames = Object.keys(volumes)
      const volumesDownload = Object.values(volumes)

      for (let i = 0; i < volumeNames.length; i++) {
        finalString = finalString + `**${volumeNames[i]}** - <${volumesDownload[i]}>\n`
      }

      return finalString
    }

    return availableVolumesString()
    // ctx.options.food ? `You like ${ctx.options.food}? Nice!` : `Hello, ${ctx.member.displayName}!`;
  }
}
