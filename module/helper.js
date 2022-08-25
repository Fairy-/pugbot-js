module.exports = {
    clamp(num, min, max) { return Math.min(Math.max(num, min), max)},
    setBotPresence(client, queuecount) {
        let player_count = client.appconf["player_count"]
        client.user.setPresence({ 
            activities: [{ name: `for ${module.exports.clamp(player_count - queuecount, 0, player_count)} more players.`, type: 3}] 
        });
    }
}