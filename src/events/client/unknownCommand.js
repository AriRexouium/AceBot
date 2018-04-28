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

    var commandMessage
    // Guild Prefix
    if (message.content.startsWith(message.guild._commandPrefix)) {
      commandMessage = message.content.split(message.guild._commandPrefix)[1]
    // Global Prefix
    } else if (message.content.startsWith(client.options.commandPrefix)) {
      commandMessage = message.content.split(client.options.commandPrefix)[1]
    // Mention Prefix
    } else if (message.content.startsWith(`<@${client.user.id}>`)) {
      commandMessage = message.content.split(`<@${client.user.id}>`)[1]
    }

    didYouMean.threshold = null
    var verify = didYouMean(commandMessage.trim(), possibleCommands)

    message.reply({
      content: oneLine`unknown command, use
    ${message.anyUsage('help', message.guild ? undefined : null, message.guild ? undefined : null)}
    to view the list of all commands.
  `,
      embed: {
        description: `Did you mean **\`${verify}\`**?`,
        color: client.getClientColor(message)
      }
    })
  }
}
