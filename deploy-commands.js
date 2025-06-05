import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { REST, Routes } from 'discord.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const { data, execute } = await import(`file://${filePath}`);
	if (data && execute) {
		commands.push(data.toJSON());
	} else {
		console.warn(
			`[WARNING] Command at ${filePath} is missing "data" or "execute".`
		);
	}
}

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

try {
	console.log(`🔁 Registering ${commands.length} commands...`);
	const data = await rest.put(
		Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
		{ body: commands }
	);
	console.log(`✅ Successfully registered ${data.length} commands.`);
} catch (error) {
	console.error('❌ Failed to register commands:', error);
}
