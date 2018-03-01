module.exports = (client, member) => {
  if (client.sqlReady === true) {
    // Global Guild Member Add (persistent)
    client.provider.set('global', 'guildMemberAdd', client.provider.get('global', 'guildMemberAdd', 0) + 1)
    // User Guild Member Add (persistent)
    client.provider.set(member.user.id, 'guildMemberAdd', client.provider.get(member.user.id, 'guildMemberAdd', 0) + 1)
    // Guild Member Add (persistent)
    client.provider.set(member.guild.id, 'guildMemberAdd', client.provider.get(member.guild.id, 'guildMemberAdd', 0) + 1)
  }
}
