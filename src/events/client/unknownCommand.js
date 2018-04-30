const { oneLine } = require('common-tags')
const didYouMean = require('didyoumean')

module.exports = (client, message) => {
  if (client.config.react.unknownCommand.enabled === true) {
    try {
      message.react(client.config.react.unknownCommand.emoji)
    } catch (error) {}
  }

  if (client.config.client.unknownCommandResponse) {
    var possibleCommands = []
    client.registry.commands.forEach(cmd => {
      possibleCommands.push(cmd.name)
      cmd.aliases.forEach(alias => {
        possibleCommands.push(alias)
      })
    })

    // Split prefix and get the invalid command used.
    var commandMessage
    // Global Prefix
    if (message.content.startsWith(client.commandPrefix)) {
      commandMessage = message.content.split(client.commandPrefix)[1]
    // Mention Prefix
    } else if (message.content.startsWith(`<@${client.user.id}>`)) {
      commandMessage = message.content.split(`<@${client.user.id}>`)[1]
    // Guild Prefix
    } else if (message.guild && message.guild.commandPrefix !== '') {
      commandMessage = message.content.split(message.guild.commandPrefix)[1]
    }

    // Find the best result.
    didYouMean.threshold = null
    var verify = didYouMean(commandMessage.trim(), possibleCommands)

    // Create the replyMessage.
    var replyMessage = {}
    replyMessage.content = oneLine`
      unknown command, use
      ${message.anyUsage('help')}
      to view the list of all commands.
    `

    // If a match is found, apply it to the replyMessage.
    if (verify) {
      replyMessage.embed = {}
      replyMessage.embed.description = `Did you mean **\`${verify}\`**?`
      replyMessage.embed.color = client.getClientColor(message)
    }

    // Send the invalid command message.
    message.reply(replyMessage)
  }
}
