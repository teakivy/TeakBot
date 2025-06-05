import { Events, EmbedBuilder } from 'discord.js';
import config from '../config.json' assert { type: 'json' };

export const name = Events.GuildMemberAdd;
export const once = false;

/**
 * @param {import('discord.js').GuildMember} member
 */
export async function execute(member) {
	// If not a bot, welcome and give role
	if (!member.user.bot) {
		const welcomeChannel = member.guild.channels.cache.get(
			config.channels.welcome
		);
		if (welcomeChannel) {
			await welcomeChannel.send(`👋 Welcome, <@${member.id}>!`);
		}

		const role = member.guild.roles.cache.get(config.roles.default);
		if (role) {
			try {
				await member.roles.add(role);
			} catch (err) {
				console.error(`❌ Failed to add role to ${member.user.tag}:`, err);
			}
		} else {
			console.warn(`⚠️ Role with ID ${config.roles.default} not found.`);
		}
	}

	// Log to modlog for both bots and humans
	const logChannel = member.guild.channels.cache.get(config.channels.logs);
	if (logChannel) {
		const embed = new EmbedBuilder()
			.setColor(config.colors.primary)
			.setTitle('🟢 Member Joined')
			.setDescription(
				`${member.user.bot ? '🤖 Bot' : '👤 User'}: <@${member.id}>`
			)
			.addFields(
				{ name: 'Tag', value: member.user.tag, inline: true },
				{ name: 'ID', value: member.id, inline: true }
			)
			.setThumbnail(member.user.displayAvatarURL())
			.setTimestamp();

		await logChannel.send({ embeds: [embed] });
	}
}
