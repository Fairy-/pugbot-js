// Require the necessary classes
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const Keyv = require('keyv');
var List = require("collections/list");
const { listenerCount } = require('node:process');
require('dotenv').config();


//Load env variables
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Load required commands and db
client.db =new Keyv('sqlite://db.sqlite');
client.db.on('error', err => console.error('Keyv connection error:', err));

client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//Load current PUG queue in case the BOT died
var queue;
(async () => {
	var result = await client.db.get("queue");

	if(!result) {
		await client.db.set("queue",JSON.stringify(""));
	} else {
		queue = new List(result);
	}
})();

//Require all commandfiles
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

//Interaction core
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);