module.exports = (client, message) => {
  if (client.sqlReady === true) {
    // Global Message Updates (persistent)
    client.provider.set('global', 'messageUpdate', client.provider.get('global', 'messageUpdate', 0) + 1)
    // User Message Updates (persistent)
    client.provider.set(message.author.id, 'messageUpdate', client.provider.get(message.author.id, 'messageUpdate', 0) + 1)
    if (message.guild) {
      // Channel Message Updates (persistent)
      client.provider.set(message.channel.id, 'messageUpdate', client.provider.get(message.channel.id, 'messageUpdate', 0) + 1)
      // Guild Message Updates (persistent)
      client.provider.set(message.guild.id, 'messageUpdate', client.provider.get(message.guild.id, 'messageUpdate', 0) + 1)
    }
  }
}
