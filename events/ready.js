module.exports = async (client) => {
  await client.log.info(`Logged in as ${client.user.tag} (${client.user.id})`, 'Discord')
  await client.user.setStatus('online')
  await client.user.setActivity(`${client.config.startSettings.commandPrefix}help | ${client.guilds.size} Guilds | ${client.users.size} Users${client.shard ? ` | ShardID: ${client.shard.id}` : ''}`)
  await setInterval(function () {
    client.user.setActivity(`${client.config.startSettings.commandPrefix}help | ${client.guilds.size} Guilds | ${client.users.size} Users${client.shard ? ` | ShardID: ${client.shard.id}` : ''}`)
  }, 600000)
  await client.log.info(client.shard ? `Shard ${client.shard.id} ready!` : 'Client ready!', 'Client', 'bgGreen')
}
