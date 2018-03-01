module.exports = (client, role) => {
  if (client.sqlReady === true) {
    // Global Emoji Creations (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'roleCreate' })
    // Guild Emoji Creations (persistent)
    client.temp.sqlData.push({ location: role.guild.id, type: 'roleCreate' })
  }
}
