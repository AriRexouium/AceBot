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
    /*
      Source Channel
    */
    if (message.channel.id === openRift.source) {
      if (message.author.id === openRift.user) {
        // Check to see if message is exit.
        if (message.content === '//exit') {
          object.splice(index, 1)
          return message.channel.send('Exited the tunnel.')
        }
        // Send message to destination.
        openRift.lastSentContent = message.content
        client.channels.get(openRift.destination).send(message.content)
      }
      /*
        Destination Channel
      */
    } else if (message.channel.id === openRift.destination) {
      // Send message to source
      if (!(openRift.lastSentContent === message.content && message.author.id === client.user.id)) {
        client.channels.get(openRift.source).send(`__**${message.author.tag}** \`(${message.author.id})\`__\n${message.content}`)
      }
    }
  })
}
