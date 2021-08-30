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
 * @returns {Discord.MessageButton}
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
 * @typedef BetterButtonReturns
 * @property {import('discord.js').InteractionCollector<any>} collector
 * @property {Discord.MessageButton} button
 */

/**
 * Creates a button and immediately starts listening, returns the collector.
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').Snowflake} id - Message id snowflage
 * @param {string} label 
 * @param {import('discord.js').MessageButtonStyleResolvable} style 
 * @param {import('discord.js').InteractionCollectorOptions} [param3] 
 * @returns {BetterButtonReturns}
 */
const quickBetterButton = (message, id, label, style, { disabled = false, timer = 60000, filter = (i) => {
		if (i.user.id !== message.author.id) return false

		if (i.customId !== id) return false

		return true 
	} 
} = {}) => {
	const button = quickButton(id, label, style, disabled)
	const collector = message.channel.createMessageComponentCollector({ timer, filter })

	return {
		collector,
		button
	}
}

exports.quickButton = quickButton
exports.quickBetterButton = quickBetterButton
