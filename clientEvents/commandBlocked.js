const { stripIndents } = require('common-tags')

module.exports = (client, message, reason) => {
  client.log.warn(stripIndents`
    ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    Reason: ${reason}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'commandBlocked')

  if (client.sqlReady === true) {
  // Global Commands Blocked (persistent)
    client.provider.set('global', 'commandBlocked', client.provider.get('global', 'commandBlocked', 0) + 1)
    // User Commands Blocked (persistent)
    client.provider.set(message.author.id, 'commandBlocked', client.provider.get(message.author.id, 'commandBlocked', 0) + 1)
    // Channel Commands Blocked (persistent)
    client.provider.set(message.channel.id, 'commandBlocked', client.provider.get(message.channel.id, 'commandBlocked', 0) + 1)
    if (message.guild) {
      // Guild Commands Blocked (persistent)
      client.provider.set(message.guild.id, 'commandBlocked', client.provider.get(message.guild.id, 'commandBlocked', 0) + 1)
    }
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
