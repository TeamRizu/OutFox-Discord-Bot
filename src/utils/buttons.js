// Libs
const Discord = require('discord.js')

// Variables
const { MessageButton } = Discord

/**
 * 
 * @param {import('discord.js').Snowflake} id - Message id snowflage
 * @param {string} label 
 * @param {import('discord.js').MessageButtonStyleResolvable} style 
 * @param {Object<'disabled', boolean>} [param3] 
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

/**
 * Creates a button and immediately starts listening, returns the collector.
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').Snowflake} id - Message id snowflage
 * @param {string} label 
 * @param {import('discord.js').MessageButtonStyleResolvable} style 
 * @param {import('discord.js').InteractionCollectorOptions} [param3] 
 * @returns {import('discord.js').InteractionCollector<any>}
 */
const quickBetterButton = (message, id, label, style, { disabled = false, timer = 60000, filter = (i) => {
		if (i.user.id !== message.author.id) return false

		if (i.customId !== id) return false

		return true 
	} 
}) => {
	quickButton(id, label, style, disabled)
	const collector = message.channel.createMessageComponentCollector({ timer, filter })

	return collector
}

exports.quickButton = quickButton
exports.quickBetterButton = quickBetterButton
