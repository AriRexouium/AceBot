module.exports = (client, member) => {
  if (client.sqlReady === true) {
    // Global Guild Member Available (persistent)
    client.provider.set('global', 'guildMemberAvailable', client.provider.get('global', 'guildMemberAvailable', 0) + 1)
    // User Guild Member Available (persistent)
    client.provider.set(member.user.id, 'guildMemberAvailable', client.provider.get(member.user.id, 'guildMemberAvailable', 0) + 1)
    // Guild Member Available (persistent)
    client.provider.set(member.guild.id, 'guildMemberAvailable', client.provider.get(member.guild.id, 'guildMemberAvailable', 0) + 1)
  }
}
