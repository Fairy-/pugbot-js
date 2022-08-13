const { SlashCommandBuilder } = require('discord.js');
var List = require("collections/list");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Check status of the PUG queue.'),
	async execute(interaction) {
        let db = interaction.client.db;

		//Load current PUG queue
		var list = new List(await db.get("queue"));
		console.log("Loaded current PUG queue from db.");
        var playerlist;
        if (list.length === 0) {
            playerlist = "";
        } else {
            playerlist = `\n${list.join('\n')}`;
        }
        await interaction.reply(`There are currently ${list.length} players in the queue.${playerlist}`);
	},
};