module.exports = (client, members, guild) => {
  // Global Guild Members Chunk (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'guildMembersChunk' })
  // Guild Members Chunk (persistent)
  client.temp.sqlData.push({ location: guild.id, type: 'guildMembersChunk' })
  // User Guild Members Chunk (persistent)
  members.forEach(member => {
    client.temp.sqlData.push({ location: member.user.id, type: 'guildMembersChunk' })
  })
}
