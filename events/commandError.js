const { stripIndents } = require('common-tags')

module.exports = (client, command, error, message) => {
  client.log.error(stripIndents`
    ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
    User: ${message.author.tag} (${message.author.id})
    Guild: ${message.guild ? `${message.guild.name} (${message.guild.id})` : 'DMs'}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
    ${error.stack}
  `, 'commandError')
}
