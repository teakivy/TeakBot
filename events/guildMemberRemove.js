import { Events, EmbedBuilder } from 'discord.js';
import config from '../config.json' assert { type: 'json' };

export const name = Events.GuildMemberRemove;
export const once = false;

/**
 * @param {import('discord.js').GuildMember} member
 */
export async function execute(member) {
	const logChannel = member.guild.channels.cache.get(config.channels.logs);
	console.log(`Member left: ${member.user.tag} (${member.id})`);
	if (!logChannel) return;

	const embed = new EmbedBuilder()
		.setColor('#ff4f4f') // 🔴 Red for leave logs
		.setTitle('🔴 Member Left')
		.setDescription(
			`${member.user.bot ? '🤖 Bot' : '👤 User'}: ${member.user.tag}`
		)
		.addFields(
			{ name: 'ID', value: member.id, inline: true },
			{ name: 'Was Bot', value: member.user.bot ? 'Yes' : 'No', inline: true }
		)
		.setThumbnail(member.user.displayAvatarURL())
		.setTimestamp();

	await logChannel.send({ embeds: [embed] });
}
