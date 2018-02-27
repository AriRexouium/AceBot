const { oneLine } = require('common-tags')

module.exports = (client, message, group, enabled) => {
  client.log.info(oneLine`
    Group ${group.id}
    ${enabled ? 'enabled' : 'disabled'}
    ${message.guild ? `in guild ${message.guild.name} (${message.guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
  `, 'groupStatusChange')

  if (client.sqlReady === true) {
  // Global Group Status Changes (persistent)
    client.provider.set('global', 'groupStatusChange', client.provider.get('global', 'groupStatusChange', 0) + 1)
    // User Group Status Changes (persistent)
    client.provider.set(message.author.id, 'groupStatusChange', client.provider.get(message.author.id, 'groupStatusChange', 0) + 1)
    if (message.guild) {
    // Channel Group Status Changes (persistent)
      client.provider.set(message.channel.id, 'groupStatusChange', client.provider.get(message.channel.id, 'groupStatusChange', 0) + 1)
      // Guild Group Status Changes (persistent)
      client.provider.set(message.guild.id, 'groupStatusChange', client.provider.get(message.guild.id, 'groupStatusChange', 0) + 1)
    }
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.groupStatusChange) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'groupStatusChange' },
          timestamp: new Date(),
          title: `groupStatusChange${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: oneLine`
            Group ${group.id}
            ${enabled ? 'enabled' : 'disabled'}
            ${message.guild ? `in guild ${message.guild.name} \`(${message.guild.id})\`` : 'globally'}.
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
