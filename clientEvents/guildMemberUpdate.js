module.exports = (client, oldMember, newMember) => {
  // Global Guild Member Update (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'guildMemberUpdate' })
  // User Guild Member Update (persistent)
  client.temp.sqlData.push({ location: oldMember.user.id, type: 'guildMemberUpdate' })
  // Guild Member Update (persistent)
  client.temp.sqlData.push({ location: oldMember.guild.id, type: 'guildMemberUpdate' })
}
