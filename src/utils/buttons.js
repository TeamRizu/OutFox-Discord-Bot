// Libs
const Discord = require('discord.js')

// Variables
const { MessageButton } = Discord

/**
 * 
 * @param {Discord.Message} id 
 * @param {*} label 
 * @param {*} style 
 * @param {*} param3 
 * @returns 
 */
const quickButton = (id, label, style, { disabled = false } = {}) => {
	const button = new MessageButton()
		.setCustomId(id)
		.setLabel(label)
		.setStyle(style)

	if (disabled !== undefined) button.setDisabled(disabled)

	return button
}
const quickBetterButton = (message, id, label, style, { disabled = false, timer = 60000, filter = (i) => {
		if (i.user.id !== message.author.id) return false

		if (i.customId !== id) return false

		return true 
	} 
}) => {
	const button = quickButton(id, label, style, disabled)
	const collector = message.channel.createMessageComponentCollector({ timer, filter })

	return collector
}

exports.quickButton = quickButton
exports.quickBetterButton = quickBetterButton
