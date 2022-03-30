const { SlashCommand } = require('slash-create');

module.exports = class VolumesCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'volumes',
      description: 'Get links for Serenity Volumes.'
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    const volumes = {
      'Volume 1 & Winter Update': 'https://projectoutfox.com/outfox-serenity/volume-i',
      'Volume 2 (in production)': 'https://projectoutfox.com/news/outfox-serenity-volume-2-more'
    }
    const availableVolumesString = () => {
      let finalString = 'Here is a list of all serenity packs for now:\n\n'
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
