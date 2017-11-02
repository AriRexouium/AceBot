module.exports = (client) => {
  client.log.info('Client Ready!', 'Discord')
  client.log.info(`Logged in as ${client.user.tag} (${client.user.id})`, 'Discord')
  client.user.setActivity(`${client.config.startSettings.commandPrefix}help | ${client.guilds.size} Guilds | ${client.users.size} Users`)
  setInterval(function () {
    client.user.setActivity(`${client.config.startSettings.commandPrefix}help | ${client.guilds.size} Guilds | ${client.users.size} Users`)
  }, 600000)
}
