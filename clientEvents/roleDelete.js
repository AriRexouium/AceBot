module.exports = (client, role) => {
  // Global Emoji Creations (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'roleDelete' })
  // Guild Emoji Creations (persistent)
  client.temp.sqlData.push({ location: role.guild.id, type: 'roleDelete' })
}
