import { Events } from 'discord.js';
import config from '../config.json' assert { type: 'json' };

export const name = Events.InteractionCreate;
export const once = false;

/**
 * @param {import('discord.js').Interaction} interaction
 */
export async function execute(interaction) {
	// Handle multi-select dropdown for project roles
	if (
		interaction.isStringSelectMenu() &&
		interaction.customId === 'project_roles'
	) {
		const selectedRoleIds = interaction.values;
		const allRoleIds = config.roles.projects.map((role) => role.id);

		const member = interaction.guild.members.cache.get(interaction.user.id);
		if (!member) return;

		const rolesToAdd = selectedRoleIds.filter(
			(id) => !member.roles.cache.has(id)
		);
		const rolesToRemove = allRoleIds.filter(
			(id) => !selectedRoleIds.includes(id) && member.roles.cache.has(id)
		);

		try {
			if (rolesToAdd.length) await member.roles.add(rolesToAdd);
			if (rolesToRemove.length) await member.roles.remove(rolesToRemove);

			await interaction.reply({
				content: `✅ Roles updated: ${
					selectedRoleIds.length
						? selectedRoleIds.map((id) => `<@&${id}>`).join(', ')
						: '*none*'
				}`,
				ephemeral: true,
			});
		} catch (error) {
			console.error('❌ Failed to update roles:', error);
			await interaction.reply({
				content:
					'❌ There was an error updating your roles. Please try again later.',
				ephemeral: true,
			});
		}
	}
}
