const fs = require('fs')
const path = require('node:path')
require('dotenv').config()
const discord = require('discord.js')
const roblox = require('noblox.js')
const client = new discord.Client({ intents: [discord.GatewayIntentBits.Guilds] });

client.commands = new discord.Collection();

const commandsPath = path.join(__dirname, 'cmds');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(discord.Events.ClientReady, c => {
	console.log(`logged in as ${c.user.tag} (${c.user.id})`);
});

client.on(discord.Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: `ruh roh error\n\`\`\`\n${error}\n\`\`\``, ephemeral: true });
	}
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);