module.exports = (client, oldMember, newMember) => {
  if (client.sqlReady === true) {
    // Global Vote State Update (persistent)
    client.provider.set('global', 'voiceStateUpdate', client.provider.get('global', 'voiceStateUpdate', 0) + 1)
    // User Vote State Update (persistent)
    client.provider.set(oldMember.user.id, 'voiceStateUpdate', client.provider.get(oldMember.user.id, 'voiceStateUpdate', 0) + 1)
    // Guild Vote State Update (persistent)
    client.provider.set(oldMember.guild.id, 'voiceStateUpdate', client.provider.get(oldMember.guild.id, 'voiceStateUpdate', 0) + 1)
  }
}
