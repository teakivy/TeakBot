import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
client.commands = new Collection();
client.events = new Collection();

// Load commands directly from /commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const { data, execute } = await import(`file://${filePath}`);
	if (data && execute) {
		client.commands.set(data.name, { data, execute });
	} else {
		console.warn(
			`[WARNING] Command at ${filePath} is missing "data" or "execute".`
		);
	}
}

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command found for ${interaction.commandName}`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`Error executing ${interaction.commandName}:`, error);
		const content = 'Error executing command.';
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content, ephemeral: true });
		} else {
			await interaction.reply({ content, ephemeral: true });
		}
	}
});

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const { name, once, execute } = await import(`file://${filePath}`);
	if (once) {
		client.once(name, execute);
	} else {
		client.on(name, execute);
	}
}

client.once(Events.ClientReady, () => {
	console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
