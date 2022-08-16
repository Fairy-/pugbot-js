const { SlashCommandBuilder } = require('discord.js');
var Map = require("collections/map");
var List = require("collections/list");
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the PUG queue.'),
	async execute(interaction) {
		let db = interaction.client.db;
		let player_count = interaction.client.appconf["player_count"];

		//Load current PUG queue
		var map = new Map(await db.get("queue"));

		console.log("Loaded current PUG queue from db.");

		//Check if player is already in queue.
		if(map.has(interaction.user.id)) {
			await interaction.reply("You are already in the queue.");
			return;
		} 

		//Add player to queue
		map.add(interaction.user.tag,interaction.user.id);

		await db.set("queue",map.toJSON());
		console.log(`Added user ${interaction.user.tag} to PUG queue.`);
		if (map.length === player_count) {

			var playerstring = "";
			for (var item of map.keys()) {
				playerstring += `<@${item}>\n`
			}
			await interaction.reply(`${player_count} players have assembled!\n${playerstring}`);
			return;
		}
		interaction.client.user.setPresence({ 
			activities: [{ name: `for ${clamp(player_count - map.length,0,player_count)} more players.`, type: 3}] 
		});
		await interaction.reply(`${interaction.user.tag} joined the PUG queue. (${clamp(map.length,0,player_count)} / ${player_count}) `);
	},
};