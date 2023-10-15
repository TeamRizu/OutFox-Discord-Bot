const { EmbedBuilder, Client, Message, TextChannel } = require('discord.js')
const { Ofline } = require('./ofline.js')
const OFline = new Ofline()
const { capitalize, discordMessageLink } = require('./string-manipulation.js')
const { rgbFromImgURL } = require('./colors.js')
const { SerenityDB: SerenityClass } = require('./serenity-db.js')

const setUpBasicSongEmbed = (song, songColor) => {
  const highlightThumbnail = () => {
    if (song.title === 'Into My Dream') return 'https://projectoutfox.com/storage/app/media/ux/communitypack/v2/banners/Into%20My%20Dream/Into%20My%20Dream-bn.gif'

    if (song.title === 'Heartbeat') return 'https://projectoutfox.com/storage/app/media/ux/communitypack/s1/banners/Heartbeat/heartbeat-bga.gif'

    return song.graphics.banner.link
  }

  const newEmbed = new EmbedBuilder()
    .setAuthor({
      name: song.music_authors.join ? song.music_authors.join(', ') : song.music_authors, // Bandaid for small serenityDB issue which will take a bit of time to correct.
      iconURL: song.graphics.jacket.link
    })
    .setTitle(song.title)
    .setImage(song.graphics.background.link)
    .setThumbnail(highlightThumbnail())
    .setFooter({
      text: 'OutFox Online',
      iconURL: 'https://cdn.discordapp.com/emojis/1160389112461791385.webp?size=96&quality=lossless'
    })

  if (songColor) newEmbed.setColor(songColor)

  return newEmbed
}

/**
 * 
 * @param {object} channelLeaderboardObj 
 * @param {TextChannel} channel 
 * @param {Client<true>} client 
 */
const handleLeaderboardUpdate = async (
  channelLeaderboardObj,
  channel,
  client
) => {
  const SerenityDb = new SerenityClass()
  const updateStatus = await SerenityDb.updateDB()

  if (!updateStatus) {
    client.emit('error', 'Failed to collect SerenityDB data, not updating leaderboard.')
    return
  }

  const firstVolume = await SerenityDb.getVolume('v1')
  const firstVolumeWinter = await SerenityDb.getVolume('v1.5')
  const secondVolume = await SerenityDb.getVolume('v2')
  const secondVolumeWinter = await SerenityDb.getVolume('v2.5')
  const intros = [
    firstVolume,
    firstVolumeWinter,
    secondVolume,
    secondVolumeWinter,
  ]

  for (let i = 0; i < intros.length; i++) {
    const volume = intros[i]
    const imageColor = await rgbFromImgURL(volume.graphics.background.link)

    const introEmbed = new EmbedBuilder()
      .setAuthor({
        name: volume.title,
        iconURL: volume.graphics.jacket.link
      })
      .setDescription(
        volume.description
      )
      .setImage(volume.graphics.background.link)
      .setThumbnail(volume.graphics.banner.link)
      .setFooter({
        text: 'OutFox Serenity Team',
        iconURL: 'https://cdn.discordapp.com/role-icons/945697589574123550/23790f1f17e6b0bcf5a29964c6ec27f8.webp?size=16&quality=lossless'
      })

    if (imageColor) introEmbed.setColor(imageColor)

    const volumeObjectTitle = `Intro_${volume.abrev}`
    const messageIDForVolume = channelLeaderboardObj.messages[volumeObjectTitle]

    /**
     * @type {Message}
     */
    let sentMessage;
    
    if (messageIDForVolume) {
      const message = await channel.messages.fetch(messageIDForVolume)

      if (!message) {
        client.emit('error', `Failed to get already available message for volume ${volume.title}, message ID: ${messageIDForVolume}.`)
        continue
      }

      const sentMessages = Object.keys(channelLeaderboardObj.messages)
      const currentVolumeIndex = sentMessages.indexOf(volumeObjectTitle)
      let volumeSongsHyperlinks = ''

      for (let v = (currentVolumeIndex + 1), reachedAnotherVolume = false; reachedAnotherVolume === false; v++) {
        const currentMessage = sentMessages[v]

        if (!currentMessage || currentMessage.startsWith('Intro')) {
          reachedAnotherVolume = true
          continue
        }

        const messageLink = discordMessageLink(channel.guildId, channel.id, channelLeaderboardObj.messages[currentMessage])
        volumeSongsHyperlinks += '- [' + currentMessage + ']' + '(' + messageLink + ')\n'
      }

      introEmbed.setDescription(introEmbed.data.description + '\n\n' + '**Click on the song title bellow to go to its leaderboard!**' + '\n\n' + volumeSongsHyperlinks)

      sentMessage = await message.edit({
        embeds: [introEmbed]
      })
    } else {
      sentMessage = await channel.send({
        embeds: [introEmbed]
      })
    }
    
    channelLeaderboardObj.messages[volumeObjectTitle] = sentMessage.id

    const songs = volume.songs

    for (let s = 0; s < songs.length; s++) {
      const song = songs[s]

      const songColor = await rgbFromImgURL(song.graphics.background.link)

      let songEmbed = setUpBasicSongEmbed(song, songColor)
      const embeds = []

      const scores = await OFline.getScoresFromSong(song.title)

      if (!scores || Object.keys(scores).length === 0) {

        if (!channelLeaderboardObj.messages[song.title]) {
          songEmbed.setDescription('There are no scores for this song yet, go play it and leave your mark!')
          embeds.push(songEmbed)

          const sent = await channel.send({
            embeds
          })

          channelLeaderboardObj.messages[song.title] = sent.id
        }

        continue
      }

      const modes = Object.keys(scores)

      for (let m = 0; m < modes.length; m++) {
        /**
         * @type {import('./types.js').Mode}
         */
        const mode = modes[m]

        const difficulties = Object.keys(scores[mode])
        const fieldObj = {
          name: mode,
          value: ''
        }

        for (let d = 0; d < difficulties.length; d++) {
          const difficulty = difficulties[d]
          const styles = Object.keys(scores[mode][difficulty])

          for (let st = 0; st < styles.length; st++) {
            const style = styles[st]
            const songScores = scores[mode][difficulty][style]

            if (!songScores || 0 >= songScores.length) continue

            fieldObj.value += '**======== ' + difficulty.toUpperCase() + ' ========**\n\n'
            
            fieldObj.value += '**=== ' + capitalize(style) + ' ' + songScores[0].meter + ` (${songScores[0].credit.join ? songScores[0].credit.join(', ') : songScores[0].credit})` + ' ===**\n\n'

            fieldObj.value += OFline.scoresToFormattedString(songScores) + '\n\n'
          }
        }

        if (songEmbed.data.fields?.length === 25) {
          embeds.push(songEmbed)
          songEmbed = setUpBasicSongEmbed()
        }

        if (fieldObj.value === '') continue

        songEmbed.addFields([fieldObj])
      }

      const songMessageID = channelLeaderboardObj.messages[song.title]
      let sentSongEmbed;

      embeds.push(songEmbed)
      
      if (songMessageID) {
        const message = await channel.messages.fetch(songMessageID)

        if (!message) {
          client.emit('error', `Failed to get message for already existing song message ${song.title}, message ID: ${songMessageID}`)
          continue
        }

        sentSongEmbed = await message.edit({
          embeds
        })
      } else {

        /**
        * @type {Message}
        */
        sentSongEmbed = await channel.send({
          embeds
        })
      }
      
      channelLeaderboardObj.messages[song.title] = sentSongEmbed.id
    }
  }

  return channelLeaderboardObj
}

exports.handleLeaderboardUpdate = handleLeaderboardUpdate