module.exports = (client, messages) => {
  if (client.sqlReady === true) {
    // Global Messages Bulk Deleted (persistent)
    client.provider.set('global', 'messageDeleteBulk', client.provider.get('global', 'messageDeleteBulk', 0) + 1)
    // User Messages Bulk Deleted (persistent)
    var authorStore = []
    messages.forEach(message => {
      if (authorStore.includes(message.author)) return
      client.provider.set(message.author.id, 'messageDeleteBulk', client.provider.get(message.author.id, 'messageDeleteBulk', 0) + 1)
      authorStore.push(message.author)
    })
    // Channel Messages Bulk Deleted (persistent)
    client.provider.set(messages[0].channel.id, 'messageDeleteBulk', client.provider.get(messages[0].channel.id, 'messageDeleteBulk', 0) + 1)
    if (messages[0].guild) {
      // Guild Messages Bulk Deleted (persistent)
      client.provider.set(messages[0].guild.id, 'messageDeleteBulk', client.provider.get(messages[0].guild.id, 'messageDeleteBulk', 0) + 1)
    }
  }
}
