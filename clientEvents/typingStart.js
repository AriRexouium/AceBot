module.exports = (client, channel, user) => {
  if (client.sqlReady === true) {
    // Global Start Typing Count (persistent)
    client.provider.set('global', 'typingStart', client.provider.get('global', 'typingStart', 0) + 1)
    // User Start Typing Count (persistent)
    client.provider.set(user.id, 'typingStart', client.provider.get(user.id, 'typingStart', 0) + 1)
    if (channel.guild) {
      // Channel Start Typing Count (persistent)
      client.provider.set(channel.id, 'typingStart', client.provider.get(channel.id, 'typingStart', 0) + 1)
      // Guild Start Typing Count (persistent)
      client.provider.set(channel.guild.id, 'typingStart', client.provider.get(channel.guild.id, 'typingStart', 0) + 1)
    }
  }
}
