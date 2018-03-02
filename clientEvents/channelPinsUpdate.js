module.exports = (client, channel, time) => {
  // Global Pin Updates (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'channelPinsUpdate' })
  // Channel Pin Updates (persistent)
  client.temp.sqlData.push({ location: channel.id, type: 'channelPinsUpdate' })
  if (channel.guild) {
    // Guild Pin Updates (persistent)
    client.temp.sqlData.push({ location: channel.guild.id, type: 'channelPinsUpdate' })
  }
}
