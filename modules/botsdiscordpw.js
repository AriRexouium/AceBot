const unirest = require('unirest')

/**
 * Send server count to http://discordbots.org.
 * @param {string} client The client of the application.
 * @throws {any} Throws an error if sending server client server count fails.
 */
module.exports = function discordBotsPw (client) {
  var totalGuilds
  if (!client.shard) {
    totalGuilds = { 'server_count': client.guilds.size }
  } else {
    totalGuilds = { 'server_count': client.guilds.size, 'shard_id': client.shard.id, 'shard_count': client.shard.count }
  }
  try {
    unirest.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
      .headers({ 'Authorization': client.config.botlist.BotsDiscordPw.token, 'Content-Type': 'application/json' })
      .send(totalGuilds)
      .end(() => { client.log.info('Server count sent to http://bots.discord.pw.') })
  } catch (error) {
    throw new Error(error)
  }
}
