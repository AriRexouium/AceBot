module.exports = async (client) => {
  await client.log.info('Client Ready!', 'Discord')
  await client.log.info(`Logged in as ${client.user.tag} (${client.user.id})`, 'Discord')
  await client.user.setStatus('online')
  await client.user.setActivity(`${client.config.startSettings.commandPrefix}help | ${client.guilds.size} Guilds | ${client.users.size} Users`)
  await setInterval(function () {
    client.user.setActivity(`${client.config.startSettings.commandPrefix}help | ${client.guilds.size} Guilds | ${client.users.size} Users`)
  }, 600000)
}
