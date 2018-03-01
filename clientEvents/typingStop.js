module.exports = (client, channel, user) => {
  if (client.sqlReady === true) {
    // Global Stop Typing Count (persistent)
    client.provider.set('global', 'typingStop', client.provider.get('global', 'typingStop', 0) + 1)
    // User Stop Typing Count (persistent)
    client.provider.set(user.id, 'typingStop', client.provider.get(user.id, 'typingStop', 0) + 1)
    // Channel Stop Typing Count (persistent)
    client.provider.set(channel.id, 'typingStop', client.provider.get(channel.id, 'typingStop', 0) + 1)
    if (channel.guild) {
      // Guild Stop Typing Count (persistent)
      client.provider.set(channel.guild.id, 'typingStop', client.provider.get(channel.guild.id, 'typingStop', 0) + 1)
    }
  }
}
