module.exports = (client, role) => {
  if (client.sqlReady === true) {
    // Global Emoji Creations (persistent)
    client.provider.set('global', 'roleCreate', client.provider.get('global', 'roleCreate', 0) + 1)
    // Guild Emoji Creations (persistent)
    client.provider.set(role.guild.id, 'roleCreate', client.provider.get(role.guild.id, 'roleCreate', 0) + 1)
  }
}
