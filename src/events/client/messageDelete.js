module.exports = (client, message) => {
  client.temp.tunnels.forEach((tunnel, index, object) => {
    var sourceChannel = client.channels.get(tunnel.source)
    var destinationChannel = client.channels.get(tunnel.destination)
    tunnel.cache.forEach(element => {
      if (message.id === element.fromMessage.id) {
        if (message.channel.id === tunnel.source) {
          element.sentMessage.delete()
        } else if (message.channel.id === tunnel.destination) {
          element.sentMessage.edit(`__**${message.author.tag}** \`(${message.author.id})\`__ **[DELETED]**\n${message.content}`).catch(error => {
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
