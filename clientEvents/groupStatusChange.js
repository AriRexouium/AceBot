const { oneLine } = require('common-tags')

module.exports = (client, guild, group, enabled) => {
  client.log.info(oneLine`
    Group ${group.id}
    ${enabled ? 'enabled' : 'disabled'}
    ${guild.guild ? `in guild ${guild.guild.name} (${guild.guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
  `, 'groupStatusChange')

  if (client.sqlReady === true) {
    // Global Group Status Changes (persistent)
    client.provider.set('global', 'groupStatusChange', client.provider.get('global', 'groupStatusChange', 0) + 1)
    if (guild.guild) {
      // Guild Group Status Changes (persistent)
      client.provider.set(guild.guild.id, 'groupStatusChange', client.provider.get(guild.guild.id, 'groupStatusChange', 0) + 1)
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
            ${guild.guild ? `in guild ${guild.guild.name} \`(${guild.guild.id})\`` : 'globally'}.
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
