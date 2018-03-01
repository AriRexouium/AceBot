module.exports = (client, guild, user) => {
  if (client.sqlReady === true) {
    // Global Ban Removals (persistent)
    client.provider.set('global', 'guildBanRemove', client.provider.get('global', 'guildBanRemove', 0) + 1)
    // User Ban Removals (persistent)
    client.provider.set(user.id, 'guildBanRemove', client.provider.get(user.id, 'guildBanRemove', 0) + 1)
    // Guild Ban Removals (persistent)
    client.provider.set(guild.id, 'guildBanRemove', client.provider.get(guild.id, 'guildBanRemove', 0) + 1)
  }
}
