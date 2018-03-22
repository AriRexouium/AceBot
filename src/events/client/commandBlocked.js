const { stripIndents } = require('common-tags')

module.exports = (client, message, reason) => {
  client.log('warn', stripIndents`\n
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    Reason: ${reason}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Commando Blocked', message.command ? `${message.command.memberName} (${message.command.groupID})` : '')

  if (client.config.react.commandBlocked.enabled === true) {
    try {
      message.react(client.config.react.commandBlocked.emoji)
    } catch (error) {}
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandBlocked) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandBlocked' },
          timestamp: new Date(),
          title: `commandBlocked${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
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
            },
            {
              'name': 'Reason',
              'value': reason,
              'inline': true
            }
          ],
          color: 0xAA0000
        }]
      })
    }
  }
}
