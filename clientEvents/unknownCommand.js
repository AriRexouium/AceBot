module.exports = (client, message) => {
  // Global Unknown Commands (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'unknownCommand' })
  // User Unknown Commands (persistent)
  client.temp.sqlData.push({ location: message.author.id, type: 'unknownCommand' })
  // Channel Unknown Commands (persistent)
  client.temp.sqlData.push({ location: message.channel.id, type: 'unknownCommand' })
  if (message.guild) {
    // Guild Unknown Commands (persistent)
    client.temp.sqlData.push({ location: message.guild.id, type: 'unknownCommand' })
  }
}
