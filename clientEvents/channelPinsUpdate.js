module.exports = (client, channel, time) => {
  if (client.sqlReady === true) {
    // Global Pin Updates (persistent)
    client.provider.set('global', 'channelPinsUpdate', client.provider.get('global', 'channelPinsUpdate', 0) + 1)
    if (channel.guild) {
      // Channel Pin Updates (persistent)
      client.provider.set(channel.id, 'channelPinsUpdate', client.provider.get(channel.id, 'channelPinsUpdate', 0) + 1)
      // Guild Pin Updates (persistent)
      client.provider.set(channel.guild.id, 'channelPinsUpdate', client.provider.get(channel.guild.id, 'channelPinsUpdate', 0) + 1)
    }
  }
}
