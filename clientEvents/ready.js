const pluralize = require('pluralize')
const unirest = require('unirest')
const botListConfig = require('../config/botlist.json')

module.exports = async (client) => {
  await client.log.info(`Logged in as ${client.user.tag} (${client.user.id})`, 'Discord')

  await setTimeout(function () {
    client.user.setStatus(client.provider.get('global', 'clientStatus', 'online')).then(
      client.user.setActivity(`${client.config.startConfig.commandPrefix}help | ${pluralize('Guild', client.guilds.size, true)} | ${pluralize('User', client.users.size, true)}${client.shard ? ` | Shard ${client.shard.id}` : ''}`)
    )
  }, 1000)

  await setInterval(function () {
    client.user.setStatus(client.provider.get('global', 'clientStatus', 'online')).then(
      client.user.setActivity(`${client.config.startConfig.commandPrefix}help | ${pluralize('Guild', client.guilds.size, true)} | ${pluralize('User', client.users.size, true)}${client.shard ? ` | Shard ${client.shard.id}` : ''}`)
    )
  }, 600000)
  await client.log.info(client.shard ? `Shard ${client.shard.id} ready!` : 'Client ready!', 'Client', 'bgGreen')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.ready) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'ready' },
          timestamp: new Date(),
          title: `ready${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: `${client.shard ? `Shard ${client.shard.id}` : 'Master'} is ready!`,
          color: 0x00AA00
        }]
      })
    }
  }

  /* ************************************************** */

  // http://discordbots.org
  async function DiscordBotsOrg () {
    var totalGuilds
    if (!client.shard) {
      totalGuilds = await client.guilds.size
    } else {
      if (client.shard.id !== client.config.shardConfig.totalShards - 1) return
      var totalGuildsData = await client.shard.fetchClientValues('guilds.size')
      totalGuilds = await totalGuildsData.reduce((prev, val) => prev + val, 0)
    }
    unirest.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
    .headers({ 'Authorization': botListConfig.DiscordBotsOrg.token, 'Content-Type': 'application/json' })
    .send({ 'server_count': totalGuilds })
    .end(function () { client.log.info('Servercount sent to http://discordbots.org.') })
  }
  if (botListConfig.DiscordBotsOrg.enabled === true) DiscordBotsOrg(); setInterval(DiscordBotsOrg, botListConfig.DiscordBotsOrg.refreshRate)
}
