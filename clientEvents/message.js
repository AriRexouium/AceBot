const { stripIndents } = require('common-tags')

module.exports = (client, message) => {
  if (message.author.id === client.user.id) {
    // Bot Messages Sent (this session)
    client.botStats.messagesSent = client.botStats.messagesSent + 1
  } else {
    // Bot Messages Received (this session)
    client.botStats.messagesReceived = client.botStats.messagesReceived + 1
  }
  // Bot Mentions (this session)
  if (message.author.id !== client.user.id && ~message.content.indexOf(`<@${client.user.id}>`)) {
    client.botStats.clientMentions = client.botStats.clientMentions + 1
  }

  // Token Protection
  if (message.content.toLowerCase().includes(client.token.toLowerCase())) {
    client.log.info(stripIndents`
    RESET YOUR TOKEN IMMEDIATELY! YOUR TOKEN HAS BEEN EXPOSED!
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    Message: ${message.content}
    `, 'CLIENT NOTICE', 'bgRed')
  }

  // Entire Tunnel System
  client.temp.tunnels.forEach((openRift, index, object) => {
    var sourceChannel = client.channels.get(openRift.source)
    var destinationChannel = client.channels.get(openRift.destination)
    openRift.lastSentContent = message.content
    /*
      Source Channel
    */
    if (message.channel.id === openRift.source) {
      if (message.author.id === openRift.user) {
        // Check to see if message is exit.
        if (message.content === '//exit') {
          object.splice(index, 1)
          return sourceChannel.send('Exited the tunnel.').catch(() => {})
        }
        // Send message to destination.
        destinationChannel.send(message.content).catch(error => {
          sourceChannel.send(`Error sending your message: \`${error.name}: ${error.message}\``).catch(() => {
            client.log.debug('Error sending message to Source channel, disconnecting tunnel.', 'Tunnel')
            object.splice(index, 1)
          })
        })
      }
      /*
        Destination Channel
      */
    } else if (message.channel.id === openRift.destination) {
      // Send message to source
      if (!(openRift.lastSentContent === message.content && message.author.id === client.user.id)) {
        sourceChannel.send(`__**${message.author.tag}** \`(${message.author.id})\`__\n${message.content}`).catch(error => {
          sourceChannel.send(`Error receiving a message: \`${error.name}: ${error.message}\``).catch(() => {
            client.log.debug('Error sending message to Source channel, disconnecting tunnel.', 'Tunnel')
            object.splice(index, 1)
          })
        })
      }
    }
  })
}
