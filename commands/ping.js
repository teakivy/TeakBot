import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import config from '../config.json' assert { type: 'json' };

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Check bot latency and Discord API latency.');

export async function execute(interaction) {
	await interaction.reply({
		content: '🏓 Pinging...',
	});

	const sent = await interaction.fetchReply();

	const latency = sent.createdTimestamp - interaction.createdTimestamp;
	const apiLatency = interaction.client.ws.ping;
	const formattedApiLatency = apiLatency >= 0 ? `${apiLatency}ms` : 'N/A';

	const embed = new EmbedBuilder()
		.setColor(config.colors.primary)
		.setTitle('🏓 Pong!')
		.addFields(
			{ name: 'Bot Latency', value: `${latency}ms`, inline: true },
			{ name: 'API Latency', value: formattedApiLatency, inline: true }
		);

	await interaction.editReply({ content: null, embeds: [embed] });
}
