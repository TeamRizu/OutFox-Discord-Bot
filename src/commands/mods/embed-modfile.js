exports.main = async (
  { modfile } = {
    modfile: {
      name: 'Blue Archive',
      support:
        'No StepMania support, but the game is fun and deserves support.',
      video: 'https://youtu.be/-xHqglB973c',
      author: 'NAT Games',
      pack: 'Nexon Games',
      problems: 'No PC version.'
    }
  }
) => {
  const nodeuri = require('node-uri')
  const Vibrant = require('node-vibrant')
  const { EmbedBuilder } = require('discord.js')
  const embed = new EmbedBuilder()
    .setTitle(modfile.name)
    .addFields(
      {
        name: 'Port Problems',
        value: modfile.problems || 'None!',
        inline: true
      },
      {
        name: 'Engine Requirement',
        value: modfile.support,
        inline: true
      }
    )

  if (modfile.pack) {
    embed.addFields({
      name: 'Pack',
      value: modfile.pack,
      inline: true
    })
  }

  if (modfile.author) {
    embed.addFields({
      name: 'Author',
      value: modfile.author,
      inline: true
    })
  }

  if (modfile.video && ['youtube', 'youtu.be'].some((e) => modfile.video.includes(e)) && nodeuri.checkHttpsURL(modfile.video)) {
    embed.setURL(modfile.video)

    const results = modfile.video.match('[\\?&]v=([^&#]*)')
    const secondResult = modfile.video.substring(modfile.video.length - 11)
    let videoID = results === null ? modfile.video : results[1]
    // This solves this type of link https://youtu.be/oMa-fqnCVzY
    if (videoID === modfile.video && secondResult.length === 11) videoID = secondResult

    const videoURL = `https://img.youtube.com/vi/${encodeURIComponent(videoID)}/0.jpg`

    if (
      videoID &&
      videoID.length === 11 &&
      nodeuri.checkHttpsURL(videoURL)
    ) {
      embed.setImage(videoURL)

      const vibrantColor = new Map()
      const colorObj = await Vibrant.from(videoURL).getPalette(
        (err, palette) => {
          if (err) {
            console.warn(err)
            return false
          }

          const rgb = palette.Vibrant._rgb
          const componentToHex = (c) => {
            // Credits: https://stackoverflow.com/a/5624139
            const hex = c.toString(16)
            return hex.length === 1 ? '0' + hex : hex
          }

          vibrantColor.set(
            'value',
            `#${componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2])}`
          )
          return true
        }
      )

      if (colorObj) embed.setColor(vibrantColor.get('value'))
    }
  }

  return embed
}
