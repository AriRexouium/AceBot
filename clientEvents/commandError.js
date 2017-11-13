const { stripIndents } = require('common-tags')

module.exports = (client, command, error, message) => {
  client.log.error(stripIndents`
    ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
    User: ${message.author.tag} (${message.author.id})
    Guild: ${message.guild ? `${message.guild.name} (${message.guild.id})` : 'DMs'}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
    ${error.stack}
  `, 'commandError')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.commandError) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandError' },
          timestamp: new Date(),
          title: `commandError${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: stripIndents`
            ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
            User: ${message.author.tag} (${message.author.id})
            Guild: ${message.guild ? `${message.guild.name} (${message.guild.id})` : 'DMs'}
            ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
            ${error.stack}
          `,
          color: 0xAA0000
        }]
      })
    }
  }
}
