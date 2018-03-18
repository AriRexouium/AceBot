const unirest = require('unirest')

/**
 * Send server count to http://discordbots.org.
 * @param {string} client The client of the application.
 */
module.exports = function discordBotsPw (client) {
  var totalGuilds
  if (!client.shard) {
    totalGuilds = { 'server_count': client.guilds.size }
  } else {
    totalGuilds = { 'server_count': client.guilds.size, 'shard_id': client.shard.id, 'shard_count': client.shard.count }
  }

  unirest.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
    .headers({ 'Authorization': client.config.botlist.BotsDiscordPw.token, 'Content-Type': 'application/json' })
    .send(totalGuilds)
    .end(() => { client.log.info('Server count sent to http://bots.discord.pw.') })
}
