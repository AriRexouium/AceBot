module.exports = async (client, channel) => {
  if (client.sqlReady === true) {
    // Global Channel Deletions (persistent)
    client.provider.set('global', 'channelDelete', client.provider.get('global', 'channelDelete', 0) + 1)
    if (channel.guild) {
      // Guild Channel Deletions (persistent)
      client.provider.set(channel.guild.id, 'channelDelete', client.provider.get(channel.guild.id, 'channelDelete', 0) + 1)
    }
  }
}
