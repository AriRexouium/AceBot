const snekfetch = require('snekfetch')

/**
 * Send server count to http://discordbots.org.
 * @param {any} client The Commando client.
 */
module.exports = function discordBotsPw (client) {
  var totalGuilds
  if (!client.shard) {
    totalGuilds = { 'server_count': client.guilds.size }
  } else {
    totalGuilds = { 'server_count': client.guilds.size, 'shard_id': client.shard.id, 'shard_count': client.shard.count }
  }

  snekfetch.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
    .set('Authorization', client.config.botlist.BotsDiscordPw.token)
    .send(totalGuilds)
    .then(client.log('info', 'Server count sent to http://bots.discord.pw.'))
}
