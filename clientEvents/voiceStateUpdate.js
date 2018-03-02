module.exports = (client, oldMember, newMember) => {
  // Global Vote State Update (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'voiceStateUpdate' })
  // User Vote State Update (persistent)
  client.temp.sqlData.push({ location: oldMember.user.id, type: 'voiceStateUpdate' })
  // Guild Vote State Update (persistent)
  client.temp.sqlData.push({ location: oldMember.guild.id, type: 'voiceStateUpdate' })
}
