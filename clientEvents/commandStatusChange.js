const oneLine = require('common-tags').oneLine

module.exports = (client, message, group, enabled) => {
  client.log.info(oneLine`
    Command ${message.command.memberName} (${message.command.groupID})
    ${enabled ? 'enabled' : 'disabled'}
    ${message.guild ? `in guild ${message.guild.name} (${message.guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
  `, 'commandStatusChange')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.commandStatusChange) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandStatusChange' },
          timestamp: new Date(),
          title: `commandStatusChange${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: oneLine`
            Command ${message.command.memberName} \`(${message.command.groupID})\`
            ${enabled ? 'enabled' : 'disabled'}
            ${message.guild ? `in guild ${message.guild.name} \`(${message.guild.id})\`` : 'globally'}.
            ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
          `,
          color: 0x00AAAA
        }]
      })
    }
  }
}
