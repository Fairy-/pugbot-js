const { SlashCommandBuilder } = require('discord.js');
var Map = require("collections/map");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Check status of the PUG queue.'),
	async execute(interaction) {
        let db = interaction.client.db;

		//Load current PUG queue
		var map = new Map(await db.get("queue"));
		console.log("Loaded current PUG queue from db.");
        var playerlist;
        if (map.length === 0) {
            playerlist = "";
        } else {
            playerlist = `\n${Array.from(map.values()).join('\n')}`;
        }
        await interaction.reply(`There are currently ${map.length} players in the queue.${playerlist}`);
	},
};