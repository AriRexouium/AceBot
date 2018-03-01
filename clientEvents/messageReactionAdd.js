module.exports = (client, messageReaction, user) => {
  if (client.sqlReady === true) {
    // Global Message Reaction Additions (persistent)
    client.provider.set('global', 'messageReactionAdd', client.provider.get('global', 'messageReactionAdd', 0) + 1)
    // User Message Reaction Additions (persistent)
    client.provider.set(user.id, 'messageReactionAdd', client.provider.get(user.id, 'messageReactionAdd', 0) + 1)
    // Channel Message Reaction Additions (persistent)
    client.provider.set(messageReaction.message.channel.id, 'messageReactionAdd', client.provider.get(messageReaction.message.channel.id, 'messageReactionAdd', 0) + 1)
    if (messageReaction.message.guild) {
      // Guild Message Reaction Additions (persistent)
      client.provider.set(messageReaction.message.guild.id, 'messageReactionAdd', client.provider.get(messageReaction.message.guild.id, 'messageReactionAdd', 0) + 1)
    }
  }
}
