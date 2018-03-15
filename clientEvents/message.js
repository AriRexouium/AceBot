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
  client.temp.tunnels.forEach((tunnel, index, object) => {
    var sourceChannel = client.channels.get(tunnel.source)
    var destinationChannel = client.channels.get(tunnel.destination)
    var sendMessage = {}
    // Attachments
    if (message.attachments) {
      sendMessage.files = []
      message.attachments.array().forEach(attachment => {
        sendMessage.files.push(attachment.url)
      })
    }
    // Embeds
    if (message.embeds) {
      sendMessage.embed = message.embeds[0]
    }
    /*
      Source Channel
    */
    if (message.channel.id === tunnel.source) {
      if (message.author.id === tunnel.user) {
        // Check to see if message is exit.
        if (message.content === '//exit') {
          object.splice(index, 1)
          return sourceChannel.send(`Closed tunnel to \`${destinationChannel.guild.name}/#${destinationChannel.name}\``).catch(() => {})
        }
        // Send message to destination.
        sendMessage.content = message.content
        destinationChannel.send(sendMessage)
          .then(sentMessage => {
            tunnel.cache.push({
              fromMessage: message,
              sentMessage: sentMessage
            })
          })
          .catch(error => {
            sourceChannel.send(`Error sending your message: \`${error.name}: ${error.message}\``).catch(() => {
              client.log.debug(`Error sending message to Source channel, disconnecting from \`${destinationChannel.guild.name}/#${destinationChannel.name}\``, 'Tunnel')
              object.splice(index, 1)
            })
          })
        tunnel.lastSentContent = message.content
      }
      /*
        Destination Channel
      */
    } else if (message.channel.id === tunnel.destination) {
      if (!(tunnel.lastSentContent === message.content && message.author.id === client.user.id)) {
        // Content
        sendMessage.content = `__**${message.author.tag}** \`(${message.author.id})\`__\n${message.content}`
        // Send message to source
        sourceChannel.send(sendMessage)
          .then(sentMessage => {
            tunnel.cache.push({
              fromMessage: message,
              sentMessage: sentMessage
            })
          })
          .catch(error => {
            sourceChannel.send(`Error receiving a message: \`${error.name}: ${error.message}\``).catch(() => {
              client.log.debug(`Error sending message to Source channel, disconnecting from \`${destinationChannel.guild.name}/#${destinationChannel.name}\``, 'Tunnel')
              object.splice(index, 1)
            })
          })
      }
    }
  })
}
