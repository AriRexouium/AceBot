const oneLine = require('common-tags').oneLine

module.exports = (client, message, group, enabled) => {
  client.log.info(oneLine`
    Command ${message.command.memberName} (${message.command.groupID})
    ${enabled ? 'enabled' : 'disabled'}
    ${message.guild ? `in guild ${message.guild.name} (${message.guild.id})` : 'globally'}.
  `)
}
