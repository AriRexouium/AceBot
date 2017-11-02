const { stripIndents } = require('common-tags')

module.exports = (client, command, promise, message, args, fromPattern) => {
  client.botStats.commandsUsed = client.botStats.commandsUsed + 1
  client.log.info(stripIndents`
    ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
    User: ${message.author.tag} (${message.author.id})
    Guild: ${message.guild ? `${message.guild.name} (${message.guild.id})` : 'DMs'}
  `, 'commandRun')
}
