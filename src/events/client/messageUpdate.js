module.exports = (client, oldMessage, newMessage) => {
  client.temp.tunnels.forEach((tunnel, index, object) => {
    var sourceChannel = client.channels.get(tunnel.source)
    var destinationChannel = client.channels.get(tunnel.destination)
    var editMessage = {}
    // Attachments
    if (newMessage.attachments) {
      editMessage.files = []
      newMessage.attachments.array().forEach(attachment => {
        editMessage.files.push(attachment.url)
      })
    }
    // Embeds
    if (newMessage.embeds) {
      editMessage.embed = newMessage.embeds[0]
    }
    tunnel.cache.forEach(element => {
      if (newMessage.id === element.fromMessage.id) {
        if (newMessage.channel.id === tunnel.source) {
          editMessage.content = newMessage.content
          element.sentMessage.edit(editMessage).catch(error => {
            sourceChannel.send(`Error editing a message: \`${error.name}: ${error.message}\``).catch(() => {
              client.log('info', `Error a message in Source channel, disconnecting from \`${destinationChannel.guild.name}/#${destinationChannel.name}\``, 'Tunnel')
              object.splice(index, 1)
            })
          })
        } else if (newMessage.channel.id === tunnel.destination) {
          editMessage.content = `__**${newMessage.author.tag}** \`(${newMessage.author.id})\`__ **[EDITED]**\n${newMessage.content}`
          element.sentMessage.edit(editMessage).catch(error => {
            sourceChannel.send(`Error editing a message: \`${error.name}: ${error.message}\``).catch(() => {
              client.log('info', `Error a message in Source channel, disconnecting from \`${destinationChannel.guild.name}/#${destinationChannel.name}\``, 'Tunnel')
              object.splice(index, 1)
            })
          })
        }
      }
    })
  })
}
