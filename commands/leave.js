const { SlashCommandBuilder } = require('discord.js');
var List = require("collections/list");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave the PUG queue.'),
	async execute(interaction) {
		let db = interaction.client.db;

		//Load current PUG queue
		var list = new List(await db.get("queue"));
		console.log("Loaded current PUG queue from db.");

		//Check if player is already in queue.
		if(!list.find(interaction.user.tag)) {
			await interaction.reply("You are not in the queue.");
			return;
		}

		//Add player to queue
		list.delete(interaction.user.tag);
		await db.set("queue",list.toJSON());
		console.log(`Removed user ${interaction.user.tag} from PUG queue.`);
		await interaction.reply(`${interaction.user.tag} left the PUG queue.`);
	},
};