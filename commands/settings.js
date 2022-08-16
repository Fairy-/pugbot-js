const { SlashCommandBuilder } = require('discord.js');
var Map = require("collections/map");
var List = require("collections/list");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('This doesn\'t do anything right now.'),
	async execute(interaction) {
		let db = interaction.client.db;
		let player_count = interaction.client.appconf["player_count"];

		await interaction.reply(``);
	},
};