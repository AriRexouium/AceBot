module.exports = (client, oldMessage, newMessage) => {
  if (client.sqlReady === true) {
    // Global Message Updates (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'commandBlocked' })
    // User Message Updates (persistent)
    client.temp.sqlData.push({ location: oldMessage.author.id, type: 'commandBlocked' })
    // Channel Message Updates (persistent)
    client.temp.sqlData.push({ location: oldMessage.channel.id, type: 'commandBlocked' })
    if (oldMessage.guild) {
      // Guild Message Updates (persistent)
      client.temp.sqlData.push({ location: oldMessage.guild.id, type: 'commandBlocked' })
    }
  }
}
