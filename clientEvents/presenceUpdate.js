module.exports = (client, oldMember, newMember) => {
  if (client.sqlReady === true) {
    // Global Presence Updates (persistent)
    client.provider.set('global', 'presenceUpdate', client.provider.get('global', 'presenceUpdate', 0) + 1)
    // User Presence Updates (persistent)
    client.provider.set(oldMember.user.id, 'presenceUpdate', client.provider.get(oldMember.user.id, 'presenceUpdate', 0) + 1)
    // Guild Presence Updates (persistent)
    client.provider.set(oldMember.guild.id, 'presenceUpdate', client.provider.get(oldMember.guild.id, 'presenceUpdate', 0) + 1)
  }
}
