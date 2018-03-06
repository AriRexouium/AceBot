const { oneLine } = require('common-tags')

module.exports = (client, guild, group, enabled) => {
  client.log.info(oneLine`
    Group ${group.id}
    ${enabled ? 'enabled' : 'disabled'}
    ${guild.guild ? `in guild ${guild.guild.name} (${guild.guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
  `, 'groupStatusChange')

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
