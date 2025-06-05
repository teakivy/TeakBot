import { Events, EmbedBuilder } from 'discord.js';
import config from '../config.json' assert { type: 'json' };

export const name = Events.MessageUpdate;
export const once = false;

/**
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 */
export async function execute(oldMessage, newMessage) {
	if (
		oldMessage.partial ||
		newMessage.partial ||
		oldMessage.author?.bot ||
		oldMessage.content === newMessage.content
	)
		return;

	const logChannel = oldMessage.guild?.channels.cache.get(config.channels.logs);
	if (!logChannel) return;

	const embed = new EmbedBuilder()
		.setColor('#f1c40f') // Yellow
		.setTitle('✏️ Message Edited')
		.setDescription(
			`Message by <@${oldMessage.author.id}> in <#${oldMessage.channel.id}>`
		)
		.addFields(
			{
				name: 'Before',
				value: oldMessage.content?.slice(0, 1000) || '*No content*',
			},
			{
				name: 'After',
				value: newMessage.content?.slice(0, 1000) || '*No content*',
			},
			{ name: 'Message ID', value: oldMessage.id, inline: false }
		)
		.setTimestamp();

	await logChannel.send({ embeds: [embed] });
}
