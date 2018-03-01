module.exports = (client, oldMember, newMember) => {
  if (client.sqlReady === true) {
    // Global Guild Member Update (persistent)
    client.provider.set('global', 'guildMemberUpdate', client.provider.get('global', 'guildMemberUpdate', 0) + 1)
    // User Guild Member Update (persistent)
    client.provider.set(oldMember.user.id, 'guildMemberUpdate', client.provider.get(oldMember.user.id, 'guildMemberUpdate', 0) + 1)
    // Guild Member Update (persistent)
    client.provider.set(oldMember.guild.id, 'guildMemberUpdate', client.provider.get(oldMember.guild.id, 'guildMemberUpdate', 0) + 1)
  }
}
