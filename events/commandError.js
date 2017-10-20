module.exports = (client, command, error) => {
  client.log.error(`${command.memberName} (${command.groupID})\n${error}`, 'commandError')
}
