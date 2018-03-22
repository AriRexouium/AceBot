const { stripIndents } = require('common-tags')

module.exports = (client, command, promise, message, args, fromPattern) => {
  client.botStats.commandsUsed = client.botStats.commandsUsed + 1

  if (client.config.react.commandRun.enabled === true) {
    try {
      message.react(client.config.react.commandRun.emoji)
    } catch (error) {}
  }

  client.log('info', stripIndents`
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Command Run', message.command ? `${message.command.memberName} (${message.command.groupID})` : '')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandRun) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandRun' },
          timestamp: new Date(),
          title: `commandRun${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          fields: [
            {
              'name': 'Command',
              'value': message.command ? `${message.command.memberName} \`(${message.command.groupID})\`` : '',
              'inline': true
            },
            {
              'name': 'User',
              'value': `${message.author.tag} \`(${message.author.id})\``,
              'inline': true
            },
            {
              'name': 'Location',
              'value': `${message.guild ? `**Guild:** ${message.guild.name} \`(${message.guild.id})\`\n` : ''}**Channel:** ${message.guild ? `${message.channel.name} \`(${message.channel.id})\`` : 'DMs'}`,
              'inline': true
            }
          ],
          color: 0x00FFFF
        }]
      })
    }
  }
}
