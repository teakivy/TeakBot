import { Events, EmbedBuilder } from 'discord.js';
import config from '../config.json' assert { type: 'json' };

export const name = Events.MessageDelete;
export const once = false;

/**
 * @param {import('discord.js').Message} message
 */
export async function execute(message) {
	if (message.partial || message.author?.bot) return;

	const logChannel = message.guild?.channels.cache.get(config.channels.logs);
	if (!logChannel) return;

	const embed = new EmbedBuilder()
		.setColor('#ff8c00') // Orange
		.setTitle('🗑️ Message Deleted')
		.addFields(
			{
				name: 'Author',
				value: `${message.author.tag} (<@${message.author.id}>)`,
				inline: false,
			},
			{ name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
			{ name: 'Message ID', value: message.id, inline: true },
			{
				name: 'Content',
				value: message.content?.slice(0, 1000) || '*No content*',
			}
		)
		.setTimestamp();

	await logChannel.send({ embeds: [embed] });
}
