module.exports = (client, message) => {
  if (client.config.react.unknownCommand.enabled === true) {
    try {
      message.react(client.config.react.unknownCommand.emoji)
    } catch (error) {}
  }
}
