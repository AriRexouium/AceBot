module.exports = (client, oldRole, newRole) => {
  if (client.sqlReady === true) {
    // Global Emoji Updates (persistent)
    client.provider.set('global', 'roleCreate', client.provider.get('global', 'roleCreate', 0) + 1)
    // Guild Emoji Updates (persistent)
    client.provider.set(oldRole.guild.id, 'roleCreate', client.provider.get(oldRole.guild.id, 'roleCreate', 0) + 1)
  }
}
