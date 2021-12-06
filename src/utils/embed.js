// Libs
const Discord = require('discord.js')

// Variables
const { MessageEmbed } = Discord

/**
 * Fast Embed implementation
 * @typedef {Object} FastEmbedOptions
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [color]
 * @property {string} [image]
 * @property {string} [thumbnail]
 * @property {string} [footer]
 */

/**
 *
 * @param {FastEmbedOptions} param0
 * @returns {Discord.MessageEmbed}
 */
exports.embedBuilder = ({
    title,
    description,
    color,
    image,
    thumbnail,
    footer,
    url,
    fields
}) => {
    const embed = new MessageEmbed()

    if (title) embed.setTitle(title)
    if (color) embed.setColor(color)
    if (image) embed.setImage(image)
    if (footer) embed.setFooter(footer)
    if (thumbnail) embed.setThumbnail(thumbnail)
    if (description) embed.setDescription(description)
    if (url) embed.setURL(url)
    if (fields) embed.fields = fields

    return embed
}
