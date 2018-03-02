module.exports = (client, member) => {
  // Global Guild Member Remove (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'guildMembersChunk' })
  // User Guild Member Remove (persistent)
  client.temp.sqlData.push({ location: member.user.id, type: 'guildMembersChunk' })
  // Guild Member Remove (persistent)
  client.temp.sqlData.push({ location: member.guild.id, type: 'guildMembersChunk' })
}
