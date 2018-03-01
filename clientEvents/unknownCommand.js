module.exports = (client, message) => {
  if (client.sqlReady === true) {
  // Global Unknown Commands (persistent)
    client.provider.set('global', 'unknownCommand', client.provider.get('global', 'unknownCommand', 0) + 1)
    // User Unknown Commands (persistent)
    client.provider.set(message.author.id, 'unknownCommand', client.provider.get(message.author.id, 'unknownCommand', 0) + 1)
    // Channel Unknown Commands (persistent)
    client.provider.set(message.channel.id, 'unknownCommand', client.provider.get(message.channel.id, 'unknownCommand', 0) + 1)
    if (message.guild) {
      // Guild Unknown Commands (persistent)
      client.provider.set(message.guild.id, 'unknownCommand', client.provider.get(message.guild.id, 'unknownCommand', 0) + 1)
    }
  }
}
