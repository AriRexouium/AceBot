module.exports = (client, oldChannel, newChannel) => {
  if (client.sqlReady === true) {
    // Global Channel Updates (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'channelUpdate' })
    // Channel Updates (persistent)
    client.temp.sqlData.push({ location: oldChannel.id, type: 'channelUpdate' })
    if (oldChannel.guild) {
      // Guild Channel Updates (persistent)
      client.temp.sqlData.push({ location: oldChannel.guild.id, type: 'channelUpdate' })
    }
  }
}
