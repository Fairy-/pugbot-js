const { SlashCommandBuilder } = require('discord.js');
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('manage')
        .setDescription('Manage the bot or queue.')
        .addSubcommandGroup(group => 
            group.setName('queue')
            .setDescription('Manage the PUG queue.')
            .addSubcommand(command => 
                command.setName('remove')
                .setDescription('Remove someone from the queue.')
                .addUserOption(option => 
                    option.setName('user')
                    .setDescription('The user you want to remove.')
                    .setRequired(true))))
        .addSubcommandGroup(group => 
            group.setName('settings')
            .setDescription('Manage bot seettings.')
            .addSubcommand(command =>
                command.setName('playercount')
                .setDescription('Set max player count for notifying users.')
                .addIntegerOption(option => 
                    option.setName('number')
                    .setDescription('Number of players')
                    .setRequired(true)))),
	async execute(interaction) {
        let db = interaction.client.db;
        let helper = interaction.client.helper;
        let player_count = interaction.client.appconf["player_count"];

        if(interaction.options.getSubcommandGroup() === 'queue') {
            if(interaction.options.getSubcommand() === 'remove') {
                var map = new Map(await db.get("queue"));
                const user = interaction.options.getUser('user');

                if(!map.delete(user.id)) {
                    await interaction.reply({ content: `User ${user.username} is not in the queue!`, ephemeral: true });
                    return;
                }

                await db.set("queue",map.toJSON());
                console.log(`${interaction.user.username} removed ${user.username} from the queue.`);
                helper.setBotPresence(interaction.client, map.length);
                await interaction.reply(`${interaction.user.username} removed ${user.username} from the PUG queue. (${helper.clamp(map.length,0,player_count)} / ${player_count}) `);
            }
        }

        if(interaction.options.getSubcommandGroup() === 'settings') {
            if(interaction.options.getSubcommand() === 'playercount') {
                const new_player_count = interaction.options.getInteger('number');
                interaction.client.appconf["player_count"] = new_player_count;
                
                var map = new Map(await db.get("queue"));
                helper.setBotPresence(interaction.client, map.length);

                console.log(`${interaction.user.username} set the playqueue to ${new_player_count}`);
                await db.set("player_count",new_player_count);
                await interaction.reply({ content: `Set the max player count to ${new_player_count}`, ephemeral: true });
            }
        }
        
	},
};