module.exports = (client, oldChannel, newChannel) => {
  if (client.sqlReady === true) {
    // Global Channel Updates (persistent)
    client.provider.set('global', 'channelUpdate', client.provider.get('global', 'channelUpdate', 0) + 1)
    // Channel Updates (persistent)
    client.provider.set(oldChannel.id, 'channelUpdate', client.provider.get(oldChannel.id, 'channelUpdate', 0) + 1)
    if (oldChannel.guild) {
      // Guild Channel Updates (persistent)
      client.provider.set(oldChannel.guild.id, 'channelUpdate', client.provider.get(oldChannel.guild.id, 'channelUpdate', 0) + 1)
    }
  }
}
