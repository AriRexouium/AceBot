const pluralize = require('pluralize')

module.exports = async (client) => {
  await client.log.info(`Logged in as ${client.user.tag} (${client.user.id})`, 'Discord')
  await client.user.setStatus(client.config.loginConfig.defaultStatus)
  await client.user.setActivity(`${client.config.startConfig.commandPrefix}help | ${pluralize('Guild', client.guilds.size, true)} | ${pluralize('User', client.users.size, true)}${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`)
  await setInterval(function () {
    client.user.setStatus(client.lastSetStatus).then(
      client.user.setActivity(`${client.config.startConfig.commandPrefix}help | ${pluralize('Guild', client.guilds.size, true)} | ${pluralize('User', client.users.size, true)}${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`)
    )
  }, 600000)
  await client.log.info(client.shard ? `Shard ${client.shard.id} ready!` : 'Client ready!', 'Client', 'bgGreen')
}
