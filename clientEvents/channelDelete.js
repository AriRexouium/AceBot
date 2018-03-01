module.exports = async (client, channel) => {
  if (client.sqlReady === true) {
    // Global Channel Deletions (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'channelDelete' })
    if (channel.guild) {
      // Guild Channel Deletions (persistent)
      client.temp.sqlData.push({ location: channel.guild.id, type: 'channelDelete' })
    }
  }
}
