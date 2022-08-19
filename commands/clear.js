const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears the PUG queue.')
        .setDMPermission(false),
	async execute(interaction) {
        let db = interaction.client.db;

		//Load current PUG queue
		await db.set("queue",new Map().toJSON());

		console.log("Cleared current PUG queue.");
		client.user.setPresence({ 
			activities: [{ name: `for ${player_count} more players.`, type: 3}] 
		});
        await interaction.reply(`Cleared the PUG queue.`);
	},
};