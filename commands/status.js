const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Check status of the PUG queue.')
        .setDMPermission(false),
	async execute(interaction) {

        let db = interaction.client.db;
        console.log("Loading current PUG queue from db.");
		//Load current PUG queue
		var map = new Map(await db.get("queue"));
		console.log("Loaded current PUG queue from db.");
        var playerlist;
        if (map.length === 0) {
            playerlist = "";
        } else {
            playerlist = `\n${map.toArray().map((item) => {return item.name}).join('\n')}`;
        }
        await interaction.reply(`There are currently ${map.length} players in the queue.${playerlist}`);
	},
};