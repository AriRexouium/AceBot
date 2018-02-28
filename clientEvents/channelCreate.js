module.exports = async (client, channel) => {
  // Global Channel Creations (persistent)
  client.provider.set('global', 'channelCreate', client.provider.get('global', 'channelCreate', 0) + 1)
  if (channel.guild) {
    // Guild Channel Creations (persistent)
    client.provider.set(channel.guild.id, 'channelCreate', client.provider.get(channel.guild.id, 'channelCreate', 0) + 1)
  }
}
