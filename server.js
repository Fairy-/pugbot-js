// Require the necessary classes
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const Keyv = require('keyv');
var Map = require("collections/map");
const { listenerCount } = require('node:process');
const { resourceLimits } = require('node:worker_threads');
require('dotenv').config();

//Helper functions
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
function addMinutes(date, minutes) { return new Date(date.getTime() + minutes*60000);}

//Load env variables
const token = process.env.DISCORD_TOKEN;
var player_count = process.env.PLAYER_COUNT;
var timeout = process.env.TIMEOUT * 1000;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Init config
client.appconf = new Object();
client.appconf["player_count"] = player_count;

//Load required commands and dbDate.now()
client.db =new Keyv('sqlite://data/db.sqlite');
client.db.on('error', err => console.error('Keyv connection error:', err));

client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

var map;
//Init sqlite
(async () => {
	var result = await client.db.get("queue");
	if(!result) {
		await client.db.set("queue",new Map().toJSON());
	} else {
		map = new Map(result);
	}

	result = await client.db.get("player_count");
	if(!result) {
		await client.db.set("player_count",player_count);
	} else {
		player_count = result;
	}
	console.log("Initialized sqlite");
})();

//Require all commandfiles
for (const file of commandFiles) {
	console.log(`Loading command ${file}`);
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}


// When the client is ready, run this code (only once)
client.once('ready', () => {
	client.user.setPresence({ 
		activities: [{ name: `for ${clamp(player_count - map.length,0,player_count)} more players.`, type: 3}] 
	});
	console.log('Ready!');
	queueCleanup();
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

async function queueCleanup() {
	console.log("Checking for stale entries in the queue.")
	var result = new Map(await client.db.get("queue"));
	var newresult = new Map(JSON.parse(JSON.stringify(result))); //Do some hackery to deep copy (dunno if I have to do this)
	if(result.length > 0) {
		for(const player of result.values()) {
			if((Date.now() - timeout) > player.createtimestamp) {
				console.log(`Removing ${player.name} from the queue due to inactivity.`);
				await client.users.fetch(player.id).then((user) => {
						user.send("Removing you from the PUG queue due to inactivity.").catch(console.log(`Can't send DM to user ${player.name}. Skipping.`));
						newresult.delete(player.id);
				});
			}
		}
		client.user.setPresence({ 
			activities: [{ name: `for ${clamp(player_count - newresult.length,0,player_count)} more players.`, type: 3}] 
		});
		await client.db.set("queue",newresult.toJSON());
	}
	setTimeout(queueCleanup, 1000*60);
};

