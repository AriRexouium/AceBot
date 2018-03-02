module.exports = (client, messageReaction, user) => {
  // Global Message Reaction Removals (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'messageReactionRemove' })
  // User Message Reaction Removals (persistent)
  client.temp.sqlData.push({ location: user.id, type: 'messageReactionRemove' })
  // Channel Message Reaction Removals (persistent)
  client.temp.sqlData.push({ location: messageReaction.message.channel.id, type: 'messageReactionRemove' })
  if (messageReaction.message.guild) {
    // Guild Message Reaction Removals (persistent)
    client.temp.sqlData.push({ location: messageReaction.message.guild.id, type: 'messageReactionRemove' })
  }
}
