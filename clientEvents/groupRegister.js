const { stripIndents } = require('common-tags')

module.exports = (client, group, registry) => {
  client.log.info(stripIndents`
    ${group.memberName} (${group.groupID})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'groupRegister')

  if (client.sqlReady === true) {
  // Global Groups Registered (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'groupRegister' })
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.groupRegister) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'groupRegister' },
          timestamp: new Date(),
          title: `groupRegister${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: stripIndents`
            **Group Registered:** ${group.memberName} (${group.groupID})
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
