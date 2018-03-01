module.exports = (client, guild, user) => {
  if (client.sqlReady === true) {
    // Global Ban Additions (persistent)
    client.provider.set('global', 'guildBanAdd', client.provider.get('global', 'guildBanAdd', 0) + 1)
    // User Ban Additions (persistent)
    client.provider.set(user.id, 'guildBanAdd', client.provider.get(user.id, 'guildBanAdd', 0) + 1)
    // Guild Ban Additions (persistent)
    client.provider.set(guild.id, 'guildBanAdd', client.provider.get(guild.id, 'guildBanAdd', 0) + 1)
  }
}
