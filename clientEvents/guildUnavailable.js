module.exports = (client, guild) => {
  if (client.sqlReady === true) {
    // Global Unavailable (persistent)
    client.provider.set('global', 'guildUnavailable', client.provider.get('global', 'guildUnavailable', 0) + 1)
    // Guild Unavailable (persistent)
    client.provider.set(guild.id, 'guildUnavailable', client.provider.get(guild.id, 'guildUnavailable', 0) + 1)
  }
}
