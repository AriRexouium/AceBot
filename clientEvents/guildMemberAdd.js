module.exports = (client, member) => {
  if (client.sqlReady === true) {
    // Global Guild Member Add (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'guildMemberAdd' })
    // User Guild Member Add (persistent)
    client.temp.sqlData.push({ location: member.user.id, type: 'guildMemberAdd' })
    // Guild Member Add (persistent)
    client.temp.sqlData.push({ location: member.guild.id, type: 'guildMemberAdd' })
  }
}
