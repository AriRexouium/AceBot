module.exports = (client, messageReaction, user) => {
  // Global Message Reaction Additions (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'messageReactionAdd' })
  // User Message Reaction Additions (persistent)
  client.temp.sqlData.push({ location: user.id, type: 'messageReactionAdd' })
  // Channel Message Reaction Additions (persistent)
  client.temp.sqlData.push({ location: messageReaction.message.channel.id, type: 'messageReactionAdd' })
  if (messageReaction.message.guild) {
    // Guild Message Reaction Additions (persistent)
    client.temp.sqlData.push({ location: messageReaction.message.guild.id, type: 'messageReactionAdd' })
  }
}
