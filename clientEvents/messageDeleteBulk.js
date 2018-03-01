module.exports = (client, messages) => {
  if (client.sqlReady === true) {
    // Global Messages Bulk Deleted (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'messageDeleteBulk' })
    // User Messages Bulk Deleted (persistent)
    var authorStore = []
    messages.forEach(message => {
      if (authorStore.includes(message.author)) return
      client.temp.sqlData.push({ location: message.author.id, type: 'messageDeleteBulk' })
      authorStore.push(message.author)
    })
    // Channel Messages Bulk Deleted (persistent)
    client.temp.sqlData.push({ location: messages.first().channel.id, type: 'messageDeleteBulk' })
    if (messages.first().guild) {
      // Guild Messages Bulk Deleted (persistent)
      client.temp.sqlData.push({ location: messages.first().guild.id, type: 'messageDeleteBulk' })
    }
  }
}
