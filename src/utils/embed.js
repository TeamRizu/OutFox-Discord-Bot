// Libs
const Discord = require('discord.js')

// Variables
const { MessageEmbed } = Discord

exports.embedBuilder = ({ title, description, color, image, thumbnail, footer }) => {
	const embed = new MessageEmbed()

	if (title) embed.setTitle(title)
	if (color) embed.setColor(color)
	if (image) embed.setImage(image)
	if (footer) embed.setFooter(footer)
	if (thumbnail) embed.setThumbnail(thumbnail)
	if (description) embed.setDescription(description)

	return embed
}
