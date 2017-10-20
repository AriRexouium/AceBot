module.exports = (client, message) => {
  if (message.author.id === client.user.id) {
    client.botStats.messagesSent = client.botStats.messagesSent + 1
  } else {
    client.botStats.messagesRecieved = client.botStats.messagesRecieved + 1
  }
  if (message.author.id !== client.user.id && ~message.content.indexOf(client.user.id)) {
    client.botStats.clientMentions = client.botStats.clientMentions + 1
  }
}
