const { stripIndents } = require('common-tags')

module.exports = (client, message, reason) => {
  client.log.warn(stripIndents`
    ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
    User: ${message.author.tag} (${message.author.id})
    Guild: ${message.guild ? `${message.guild.name} (${message.guild.id})` : 'DMs'}
    Reason: ${reason}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'commandBlocked')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.commandBLocked) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandBLocked' },
          timestamp: new Date(),
          title: `commandBLocked${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: stripIndents`
            ${message.command ? `${message.command.memberName} \`(${message.command.groupID})\`` : ''}
            **User:** ${message.author.tag} \`(${message.author.id})\`
            **Guild:** ${message.guild ? `${message.guild.name} \`(${message.guild.id})\`` : 'DMs'}
            **Reason:** ${reason}
          `,
          color: 0xAA0000
        }]
      })
    }
  }
}
