module.exports = (client, command, registry) => {
  client.log.info(`${command.memberName} ${command.groupID}`, 'commandRegister')
}
