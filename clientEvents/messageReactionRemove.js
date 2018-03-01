module.exports = (client, messageReaction, user) => {
  if (client.sqlReady === true) {
    // Global Message Reaction Removals (persistent)
    client.provider.set('global', 'messageReactionRemove', client.provider.get('global', 'messageReactionRemove', 0) + 1)
    // User Message Reaction Removals (persistent)
    client.provider.set(user.id, 'messageReactionRemove', client.provider.get(user.id, 'messageReactionRemove', 0) + 1)
    // Channel Message Reaction Removals (persistent)
    client.provider.set(messageReaction.message.channel.id, 'messageReactionRemove', client.provider.get(messageReaction.message.channel.id, 'messageReactionRemove', 0) + 1)
    if (messageReaction.message.guild) {
      // Guild Message Reaction Removals (persistent)
      client.provider.set(messageReaction.message.guild.id, 'messageReactionRemove', client.provider.get(messageReaction.message.guild.id, 'messageReactionRemove', 0) + 1)
    }
  }
}
