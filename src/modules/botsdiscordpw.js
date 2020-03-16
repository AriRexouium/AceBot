const snekfetch = require('snekfetch')

/**
 * Send server count to https://discordbots.org.
 * @param {any} client The CommandoClient.
 * @return {Promise<any>}
 */
module.exports = function discordBotsPw (client) {
  return new Promise((resolve, reject) => {
    var totalGuilds
    if (!client.shard) {
      totalGuilds = { server_count: client.guilds.size }
    } else {
      totalGuilds = { server_count: client.guilds.size, shard_id: client.shard.id, shard_count: client.shard.count }
    }

    snekfetch.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
      .set('Authorization', client.config.botlist.BotsDiscordPw.token)
      .send(totalGuilds)
      .then((data, error) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(data)
        }
      })
  })
}
