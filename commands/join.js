const { SlashCommandBuilder } = require('discord.js');
var List = require("collections/list");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the PUG queue.'),
	async execute(interaction) {
		let db = interaction.client.db;

		//Load current PUG queue
		var list = new List(await db.get("queue"));
		console.log("Loaded current PUG queue from db.");

		//Check if player is already in queue.
		if(list.find(interaction.user.tag)) {
			await interaction.reply("You are already in the queue.");
			return;
		}

		//Add player to queue
		list.add(interaction.user.tag);
		await db.set("queue",list.toJSON());
		console.log(`Added user ${interaction.user.tag} to PUG queue.`);
		await interaction.reply(`${interaction.user.tag} joined the PUG queue.`);
	},
};