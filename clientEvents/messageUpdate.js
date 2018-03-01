module.exports = (client, oldMessage, newMessage) => {
  if (client.sqlReady === true) {
    // Global Message Updates (persistent)
    client.provider.set('global', 'messageUpdate', client.provider.get('global', 'messageUpdate', 0) + 1)
    // User Message Updates (persistent)
    client.provider.set(oldMessage.author.id, 'messageUpdate', client.provider.get(oldMessage.author.id, 'messageUpdate', 0) + 1)
    // Channel Message Updates (persistent)
    client.provider.set(oldMessage.channel.id, 'messageUpdate', client.provider.get(oldMessage.channel.id, 'messageUpdate', 0) + 1)
    if (oldMessage.guild) {
      // Guild Message Updates (persistent)
      client.provider.set(oldMessage.guild.id, 'messageUpdate', client.provider.get(oldMessage.guild.id, 'messageUpdate', 0) + 1)
    }
  }
}
