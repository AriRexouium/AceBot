module.exports = (client, role) => {
  if (client.sqlReady === true) {
    // Global Emoji Creations (persistent)
    client.provider.set('global', 'roleDelete', client.provider.get('global', 'roleDelete', 0) + 1)
    // Guild Emoji Creations (persistent)
    client.provider.set(role.guild.id, 'roleDelete', client.provider.get(role.guild.id, 'roleDelete', 0) + 1)
  }
}
