import {
	Events,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	ChannelType,
} from 'discord.js';
import config from '../config.json' assert { type: 'json' };

export const name = Events.MessageCreate;
export const once = false;

/**
 * @param {import('discord.js').Message} message
 */
export async function execute(message) {
	if (message.author.bot) return;

	// Bot is mentioned directly (not as part of a command)
	if (
		message.mentions.has(message.client.user, {
			ignoreEveryone: true,
			ignoreRoles: true,
		})
	) {
		return message.reply('👋');
	}

	if (message.content === '!sendReactionRoles') {
		// Admin only
		if (!message.member.permissions.has('Administrator')) {
			return message.reply('❌ You must be an admin to use this.');
		}

		const options = config.roles.projects.map((role) => ({
			label: role.label,
			value: role.id,
			emoji: role.emoji,
		}));

		const select = new StringSelectMenuBuilder()
			.setCustomId('project_roles')
			.setPlaceholder('Select the projects you want updates for')
			.setMinValues(0)
			.setMaxValues(options.length)
			.addOptions(options);

		const row = new ActionRowBuilder().addComponents(select);

		const targetChannel = message.guild.channels.cache.get(
			config.channels.roles
		);
		if (!targetChannel || targetChannel.type !== ChannelType.GuildText) {
			return message.reply(
				'❌ Configured roles channel is missing or invalid.'
			);
		}

		await targetChannel.send({
			content: "Select which projects you'd like to get updates about:",
			components: [row],
		});

		message.delete();
	}
}
