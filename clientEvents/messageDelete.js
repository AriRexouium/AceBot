module.exports = (client, message) => {
  if (client.sqlReady === true) {
    // Global Messages Deleted (persistent)
    client.provider.set('global', 'messageDelete', client.provider.get('global', 'messageDelete', 0) + 1)
    // User Messages Deleted (persistent)
    client.provider.set(message.author.id, 'messageDelete', client.provider.get(message.author.id, 'messageDelete', 0) + 1)
    // Channel Messages Deleted (persistent)
    client.provider.set(message.channel.id, 'messageDelete', client.provider.get(message.channel.id, 'messageDelete', 0) + 1)
    if (message.guild) {
      // Guild Messages Deleted (persistent)
      client.provider.set(message.guild.id, 'messageDelete', client.provider.get(message.guild.id, 'messageDelete', 0) + 1)
    }
  }
}
