module.exports = (client, channel, user) => {
  if (client.sqlReady === true) {
    // Global Start Typing Count (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'commandBlocked' })
    // User Start Typing Count (persistent)
    client.temp.sqlData.push({ location: user.id, type: 'commandBlocked' })
    // Channel Start Typing Count (persistent)
    client.temp.sqlData.push({ location: channel.id, type: 'commandBlocked' })
    if (channel.guild) {
      // Guild Start Typing Count (persistent)
      client.temp.sqlData.push({ location: channel.guild.id, type: 'commandBlocked' })
    }
  }
}
