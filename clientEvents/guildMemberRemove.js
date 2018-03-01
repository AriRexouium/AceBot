module.exports = (client, member) => {
  if (client.sqlReady === true) {
    // Global Guild Member Remove (persistent)
    client.provider.set('global', 'guildMembersChunk', client.provider.get('global', 'guildMembersChunk', 0) + 1)
    // User Guild Member Remove (persistent)
    client.provider.set(member.user.id, 'guildMembersChunk', client.provider.get(member.user.id, 'guildMembersChunk', 0) + 1)
    // Guild Member Remove (persistent)
    client.provider.set(member.guild.id, 'guildMembersChunk', client.provider.get(member.guild.id, 'guildMembersChunk', 0) + 1)
  }
}
