module.exports = (client, channel) => {
  // Global Channel Creations (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'channelCreate' })
  if (channel.guild) {
    // Guild Channel Creations (persistent)
    client.temp.sqlData.push({ location: channel.guild.id, type: 'channelCreate' })
  }
}
