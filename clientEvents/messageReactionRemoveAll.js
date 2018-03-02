module.exports = (client, message) => {
  // Global Message Reaction Removals (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'messageReactionRemoveAll' })
  // User Message Reaction Removals (persistent)
  client.temp.sqlData.push({ location: message.author.id, type: 'messageReactionRemoveAll' })
  // Channel Message Reaction Removals (persistent)
  client.temp.sqlData.push({ location: message.channel.id, type: 'messageReactionRemoveAll' })
  if (message.guild) {
    // Guild Message Reaction Removals (persistent)
    client.temp.sqlData.push({ location: message.guild.id, type: 'messageReactionRemoveAll' })
  }
}
