module.exports = (client, members, guild) => {
  if (client.sqlReady === true) {
    // Global Guild Members Chunk (persistent)
    client.provider.set('global', 'guildMembersChunk', client.provider.get('global', 'guildMembersChunk', 0) + 1)
    // Guild Members Chunk (persistent)
    client.provider.set(guild.id, 'guildMembersChunk', client.provider.get(guild.id, 'guildMembersChunk', 0) + 1)
    // User Guild Members Chunk (persistent)
    members.forEach(member => {
      client.provider.set(member.user.id, 'guildMembersChunk', client.provider.get(member.user.id, 'guildMembersChunk', 0) + 1)
    })
  }
}
