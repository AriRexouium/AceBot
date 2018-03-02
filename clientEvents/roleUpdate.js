module.exports = (client, oldRole, newRole) => {
  // Global Emoji Updates (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'roleCreate' })
  // Guild Emoji Updates (persistent)
  client.temp.sqlData.push({ location: oldRole.guild.id, type: 'roleCreate' })
}
