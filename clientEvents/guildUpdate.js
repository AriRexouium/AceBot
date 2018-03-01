module.exports = (client, oldGuild, newGuild) => {
  if (client.sqlReady === true) {
    // Global Guild Updates (persistent)
    client.provider.set('global', 'guildUpdate', client.provider.get('global', 'guildUpdate', 0) + 1)
    // Guild Updates (persistent)
    client.provider.set(oldGuild.id, 'guildUpdate', client.provider.get(oldGuild.id, 'guildUpdate', 0) + 1)
  }
}
