const { SlashCommandBuilder } = require('discord.js');
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave the PUG queue.')
		.setDMPermission(false),
	async execute(interaction) {
		let db = interaction.client.db;
		let player_count = interaction.client.appconf["player_count"];

		//Load current PUG queue
		var map = new Map(await db.get("queue"));
		console.log("Loaded current PUG queue from db.");

		//Check if player is already in queue.
		if(!map.has(interaction.user.id)) {
			await interaction.reply("You are not in the queue.");
			return;
		}

		//Add player to queue
		map.delete(interaction.user.id);
		await db.set("queue",map.toJSON());
		
		console.log(`Removed user ${interaction.user.tag} from PUG queue.`);
		interaction.client.user.setPresence({ 
			activities: [{ name: `for ${clamp(player_count - map.length,0,player_count)} more players.`, type: 3}] 
		});
		await interaction.reply(`${interaction.user.tag} left the PUG queue. (${clamp(map.length,0,player_count)} / ${player_count})`);
	},
};