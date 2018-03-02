module.exports = (client, channel, user) => {
  // Global Stop Typing Count (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'typingStop' })
  // User Stop Typing Count (persistent)
  client.temp.sqlData.push({ location: user.id, type: 'typingStop' })
  // Channel Stop Typing Count (persistent)
  client.temp.sqlData.push({ location: channel.id, type: 'typingStop' })
  if (channel.guild) {
    // Guild Stop Typing Count (persistent)
    client.temp.sqlData.push({ location: channel.guild.id, type: 'typingStop' })
  }
}
