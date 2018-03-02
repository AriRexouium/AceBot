module.exports = (client, message) => {
  // Global Messages Deleted (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'messageDelete' })
  // User Messages Deleted (persistent)
  client.temp.sqlData.push({ location: message.author.id, type: 'messageDelete' })
  // Channel Messages Deleted (persistent)
  client.temp.sqlData.push({ location: message.channel.id, type: 'messageDelete' })
  if (message.guild) {
    // Guild Messages Deleted (persistent)
    client.temp.sqlData.push({ location: message.guild.id, type: 'messageDelete' })
  }
}
