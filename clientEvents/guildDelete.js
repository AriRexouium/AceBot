const { stripIndents } = require('common-tags')

module.exports = (client, guild) => {
  client.log.info(stripIndents`
    Guild: ${guild.name} (${guild.id})
    Owner: ${guild.owner.user.tag} (${guild.owner.user.id})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'guildDelete')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.guildDelete) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'guildDelete' },
          timestamp: new Date(),
          title: `guildDelete${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          fields: [
            {
              'name': 'Guild',
              'value': `${guild.name} \`(${guild.id})\``,
              'inline': true
            },
            {
              'name': 'Owner',
              'value': `${guild.owner.user.tag} \`(${guild.owner.user.id})\``,
              'inline': true
            }
          ],
          color: 0x4D4DFF
        }]
      })
    }
  }
}
