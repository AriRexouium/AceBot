module.exports = (client, message) => {
  if (client.sqlReady === true) {
    // Global Message Reaction Removals (persistent)
    client.provider.set('global', 'messageReactionRemoveAll', client.provider.get('global', 'messageReactionRemoveAll', 0) + 1)
    // User Message Reaction Removals (persistent)
    client.provider.set(message.author.id, 'messageReactionRemoveAll', client.provider.get(message.author.id, 'messageReactionRemoveAll', 0) + 1)
    // Channel Message Reaction Removals (persistent)
    client.provider.set(message.channel.id, 'messageReactionRemoveAll', client.provider.get(message.channel.id, 'messageReactionRemoveAll', 0) + 1)
    if (message.guild) {
      // Guild Message Reaction Removals (persistent)
      client.provider.set(message.guild.id, 'messageReactionRemoveAll', client.provider.get(message.guild.id, 'messageReactionRemoveAll', 0) + 1)
    }
  }
}
