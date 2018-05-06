const { oneLine } = require('common-tags')
const { escapeMarkdown } = require('discord.js')

module.exports = (client, info) => {
  var eventName = client.getFileName(__filename)
  client.log('warn', oneLine`
    ${info}
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents[eventName]) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: eventName },
          timestamp: new Date(),
          title: `Client Warning${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + escapeMarkdown(info.stack, true) + '\n```',
          color: 0xFFFF00
        }]
      })
    }
  }
}
